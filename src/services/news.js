const axios = require('axios')

// Data source: NewsAPI (free tier). Responses are cached in-memory to stay well
// under the free 100-requests/day quota and to keep the app fast.
const ENDPOINT = 'https://newsapi.org/v2/everything'
const HTTP_TIMEOUT = 6000
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_ARTICLES = 100 // NewsAPI free tier caps a query at 100 results
const SUMMARY_WORDS = 42

const cache = new Map()

// Regions the reader can browse. `q` is the NewsAPI /everything query
// (top-headlines?country= returns no sources for several countries, so we
// query by name — validated to return full result sets).
const REGIONS = [
    { code: 'world', label: 'Worldwide', flag: '🌐', q: 'world' },
    { code: 'in', label: 'India', flag: '🇮🇳', q: 'India' },
    { code: 'us', label: 'United States', flag: '🇺🇸', q: 'United States' },
    { code: 'gb', label: 'United Kingdom', flag: '🇬🇧', q: 'United Kingdom' },
    { code: 'ca', label: 'Canada', flag: '🇨🇦', q: 'Canada' },
    { code: 'au', label: 'Australia', flag: '🇦🇺', q: 'Australia' },
    { code: 'ae', label: 'UAE', flag: '🇦🇪', q: 'United Arab Emirates' },
    { code: 'sg', label: 'Singapore', flag: '🇸🇬', q: 'Singapore' },
    { code: 'de', label: 'Germany', flag: '🇩🇪', q: 'Germany' },
    { code: 'fr', label: 'France', flag: '🇫🇷', q: 'France' },
    { code: 'jp', label: 'Japan', flag: '🇯🇵', q: 'Japan' },
    { code: 'cn', label: 'China', flag: '🇨🇳', q: 'China' },
]
const DEFAULT_REGION = 'world'

const regionByCode = (code) => REGIONS.find((r) => r.code === code) || REGIONS.find((r) => r.code === DEFAULT_REGION)

// Lightweight, free, deterministic category tagging (no external service).
const CATEGORY_RULES = [
    ['Business', /\b(market|stocks?|economy|econom|trade|business|rupee|sensex|nifty|gdp|inflation|ipo|invest|funding|bank|revenue|profit|earnings|tariff)\b/i],
    ['Technology', /\b(tech|technolog|\bai\b|software|app|google|apple|microsoft|smartphone|gadget|chip|semiconductor|internet|cyber|crypto|bitcoin|startup)\b/i],
    ['Sports', /\b(cricket|football|soccer|match|tournament|olympic|\bipl\b|world cup|bcci|fifa|nba|tennis|hockey|innings|wicket)\b/i],
    ['Entertainment', /\b(movie|film|bollywood|hollywood|actor|actress|music|album|box office|celebrity|trailer|netflix|\bott\b)\b/i],
    ['Science', /\b(science|space|isro|nasa|research|scientist|climate|physics|astronom|rocket|satellite)\b/i],
    ['Health', /\b(health|covid|vaccine|hospital|disease|medical|doctor|virus|outbreak|wellness)\b/i],
    ['Politics', /\b(election|parliament|minister|govern|policy|vote|court|supreme court|\bbill\b|\blaw\b|diplomat)\b/i],
    ['World', /\b(china|russia|ukraine|united nations|europe|pakistan|global|foreign|border|\bwar\b|summit)\b/i],
]

const clean = (s) => (s == null ? '' : String(s)).replace(/\s+/g, ' ').trim()

// NewsAPI truncates content with markers like "… [+1234 chars]" — drop them.
const stripTrailing = (s) => s.replace(/\s*\[\+\d+\s*chars\]\s*$/i, '').replace(/[…\s]+$/, '').trim()

function summarize(text, maxWords) {
    const t = stripTrailing(clean(text))
    if (!t) return ''
    const words = t.split(' ')
    if (words.length <= maxWords) return t
    return words.slice(0, maxWords).join(' ').replace(/[,;:.\-–—]+$/, '') + '…'
}

function categorize(title, description) {
    const hay = `${title} ${description}`.toLowerCase()
    for (const [cat, re] of CATEGORY_RULES) if (re.test(hay)) return cat
    return 'Top'
}

function normalize(a) {
    const title = clean(a.title)
    const description = clean(a.description)
    return {
        title,
        url: a.url,
        urlToImage: a.urlToImage || null,
        source: a.source && a.source.name ? { name: clean(a.source.name) } : null,
        summary: summarize(description, SUMMARY_WORDS) || summarize(title, SUMMARY_WORDS),
        category: categorize(title, description),
        publishedAt: a.publishedAt || null,
    }
}

async function fetchRaw(query) {
    const key = query.toLowerCase()
    const hit = cache.get(key)
    if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.v

    const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${MAX_ARTICLES}&apiKey=${process.env.API_KEY}`
    const res = await axios.get(url, { timeout: HTTP_TIMEOUT })
    const articles = Array.isArray(res.data.articles) ? res.data.articles : []
    cache.set(key, { t: Date.now(), v: articles })
    return articles
}

// A search term takes priority; otherwise fall back to the chosen region's feed.
async function getNews({ region, search } = {}) {
    const term = clean(search)
    const q = term || regionByCode(region).q
    const raw = await fetchRaw(q)
    return raw
        .filter((a) => a && a.url && a.title && a.title !== '[Removed]')
        .slice(0, MAX_ARTICLES)
        .map(normalize)
}

module.exports = { getNews, REGIONS, DEFAULT_REGION, regionByCode }
