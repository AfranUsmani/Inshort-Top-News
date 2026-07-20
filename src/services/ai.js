const Anthropic = require('@anthropic-ai/sdk')

// Model is configurable. Default to Haiku 4.5 — this runs on every page load and
// the task (short news summaries) is simple, so it's the cost/latency-sensible
// default. Set AI_MODEL=claude-opus-4-8 in the environment for higher quality.
const MODEL = process.env.AI_MODEL || 'claude-haiku-4-5'
const AI_ENABLED = Boolean(process.env.ANTHROPIC_API_KEY)

const MAX_ITEMS = 12          // curated "in-short" deck size
const CACHE_TTL_MS = 15 * 60 * 1000
const MAX_DESC = 220          // truncate source text to control input tokens

const CATEGORIES = ['Politics', 'Business', 'Technology', 'Sports', 'Entertainment', 'Science', 'Health', 'World', 'India', 'Top']

const client = AI_ENABLED
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 6000 })
    : null

// In-memory cache — persists per warm serverless instance, so repeat loads of the
// same headline set skip the model call entirely.
const cache = new Map()

const clean = (s) => (s == null ? '' : String(s).trim())

function normalizeCategory(raw) {
    const c = clean(raw)
    if (!c) return null
    const hit = CATEGORIES.find((k) => k.toLowerCase() === c.toLowerCase())
    return hit || 'Top'
}

function fallback(articles, enabled) {
    return {
        aiEnabled: enabled,
        briefing: null,
        items: articles.map((a) => ({
            ...a,
            aiSummary: clean(a.description) || clean(a.title),
            category: null,
        })),
    }
}

function cacheKey(articles) {
    return `${MODEL}::` + articles.map((a) => a.url).join('|')
}

function buildPrompt(articles) {
    const list = articles
        .map((a, i) => `${i + 1}. ${clean(a.title)} — ${clean(a.description).slice(0, MAX_DESC)}`)
        .join('\n')

    return [
        'You are the editor of "InShort", an Indian news app that turns articles into crisp, neutral summaries.',
        '',
        'Return ONLY minified JSON (no markdown, no code fences, no commentary) with exactly this shape:',
        '{"briefing":"<=45 word, 2-sentence overview of the top stories","articles":[{"summary":"~40 word neutral summary","category":"one of: Politics, Business, Technology, Sports, Entertainment, Science, Health, World, India"}]}',
        '',
        `The "articles" array MUST contain exactly ${articles.length} objects, in the same order as the input below.`,
        'Summaries must be factual and self-contained. Do not invent details not present in the title/description.',
        '',
        'Articles:',
        list,
    ].join('\n')
}

function parseJSON(text) {
    let t = clean(text)
    // strip accidental code fences
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/,'').trim()
    const start = t.indexOf('{')
    const end = t.lastIndexOf('}')
    if (start !== -1 && end !== -1) t = t.slice(start, end + 1)
    return JSON.parse(t)
}

async function enhance(articles) {
    const list = Array.isArray(articles) ? articles.filter((a) => a && a.url) : []
    if (list.length === 0) return { aiEnabled: AI_ENABLED, briefing: null, items: [] }

    const top = list.slice(0, MAX_ITEMS)
    if (!client) return fallback(top, false)

    const key = cacheKey(top)
    const hit = cache.get(key)
    if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.v

    try {
        const msg = await client.messages.create({
            model: MODEL,
            max_tokens: 1400,
            messages: [{ role: 'user', content: buildPrompt(top) }],
        })
        const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
        const data = parseJSON(text)
        const summaries = Array.isArray(data.articles) ? data.articles : []

        const items = top.map((a, i) => ({
            ...a,
            aiSummary: clean(summaries[i] && summaries[i].summary) || clean(a.description) || clean(a.title),
            category: normalizeCategory(summaries[i] && summaries[i].category),
        }))

        const result = { aiEnabled: true, briefing: clean(data.briefing) || null, items }
        cache.set(key, { t: Date.now(), v: result })
        return result
    } catch (err) {
        console.error('AI enhance failed, serving plain summaries:', err.message)
        return fallback(top, true)
    }
}

module.exports = { enhance, AI_ENABLED, MODEL }
