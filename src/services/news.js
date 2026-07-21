const Parser = require('rss-parser')

// Live headlines from Google News RSS — real-time, free, no API key, no quota.
const parser = new Parser({
    timeout: 7000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InShortNews/1.0)' },
})

const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_ARTICLES = 100

const cache = new Map()

// Regions map to Google News editions (country + English). `world` uses the
// World topic feed. All validated to return live, English-language headlines.
const REGIONS = [
    { code: 'world', label: 'Worldwide', flag: '🌐' },
    { code: 'in', label: 'India', flag: '🇮🇳', cc: 'IN' },
    { code: 'us', label: 'United States', flag: '🇺🇸', cc: 'US' },
    { code: 'gb', label: 'United Kingdom', flag: '🇬🇧', cc: 'GB' },
    { code: 'ca', label: 'Canada', flag: '🇨🇦', cc: 'CA' },
    { code: 'au', label: 'Australia', flag: '🇦🇺', cc: 'AU' },
    { code: 'ae', label: 'UAE', flag: '🇦🇪', cc: 'AE' },
    { code: 'sg', label: 'Singapore', flag: '🇸🇬', cc: 'SG' },
    { code: 'de', label: 'Germany', flag: '🇩🇪', cc: 'DE' },
    { code: 'fr', label: 'France', flag: '🇫🇷', cc: 'FR' },
    { code: 'jp', label: 'Japan', flag: '🇯🇵', cc: 'JP' },
    { code: 'cn', label: 'China', flag: '🇨🇳', cc: 'CN' },
]
const DEFAULT_REGION = 'world'

const regionByCode = (code) => REGIONS.find((r) => r.code === code) || REGIONS.find((r) => r.code === DEFAULT_REGION)

const WORLD_URL = 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en'
const editionUrl = (cc) => `https://news.google.com/rss?hl=en-${cc}&gl=${cc}&ceid=${cc}:en`
const searchUrl = (q) => `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`

// Free, deterministic category tagging from the headline text.
const CATEGORY_RULES = [
    ['Business', /\b(market|stocks?|economy|econom|trade|business|rupee|dollar|sensex|nifty|gdp|inflation|ipo|invest|funding|bank|revenue|profit|earnings|tariff)\b/i],
    ['Technology', /\b(tech|technolog|\bai\b|software|app|google|apple|microsoft|smartphone|gadget|chip|semiconductor|internet|cyber|crypto|bitcoin|startup)\b/i],
    ['Sports', /\b(cricket|football|soccer|match|tournament|olympic|\bipl\b|world cup|bcci|fifa|nba|tennis|hockey|innings|wicket|goal)\b/i],
    ['Entertainment', /\b(movie|film|bollywood|hollywood|actor|actress|music|album|box office|celebrity|trailer|netflix|\bott\b)\b/i],
    ['Science', /\b(science|space|isro|nasa|research|scientist|climate|physics|astronom|rocket|satellite)\b/i],
    ['Health', /\b(health|covid|vaccine|hospital|disease|medical|doctor|virus|outbreak|wellness)\b/i],
    ['Politics', /\b(election|parliament|minister|govern|policy|vote|court|supreme court|\bbill\b|\blaw\b|diplomat|president|prime minister)\b/i],
    ['World', /\b(china|russia|ukraine|united nations|europe|pakistan|global|foreign|border|\bwar\b|summit|israel|gaza)\b/i],
]

const clean = (s) => (s == null ? '' : String(s)).replace(/\s+/g, ' ').trim()

function categorize(title) {
    const hay = title.toLowerCase()
    for (const [cat, re] of CATEGORY_RULES) if (re.test(hay)) return cat
    return 'Top'
}

// Google News titles are "Headline - Source"; split them apart.
function splitTitle(rawTitle) {
    const t = clean(rawTitle)
    const idx = t.lastIndexOf(' - ')
    if (idx > 0) return { title: t.slice(0, idx), source: t.slice(idx + 3) }
    return { title: t, source: '' }
}

function normalize(item) {
    const { title, source } = splitTitle(item.title)
    return {
        title,
        url: item.link,
        urlToImage: null, // RSS has no thumbnails
        source: source ? { name: source } : null,
        summary: '', // headline-only feed; no summary
        category: categorize(title),
        publishedAt: item.isoDate || item.pubDate || null,
    }
}

async function fetchFeed(url) {
    const hit = cache.get(url)
    if (hit && Date.now() - hit.t < CACHE_TTL_MS) return hit.v

    const feed = await parser.parseURL(url)
    const items = (feed.items || [])
        .filter((it) => it && it.title && it.link)
        .slice(0, MAX_ARTICLES)
        .map(normalize)
    cache.set(url, { t: Date.now(), v: items })
    return items
}

// A search term takes priority; otherwise fetch the chosen region's live feed.
async function getNews({ region, search } = {}) {
    const term = clean(search)
    if (term) return fetchFeed(searchUrl(term))
    const r = regionByCode(region)
    return fetchFeed(r.code === 'world' ? WORLD_URL : editionUrl(r.cc))
}

// Relative time label, e.g. "just now", "23m ago", "4h ago", "2d ago", "14 Jul".
function timeAgo(iso) {
    if (!iso) return ''
    const then = new Date(iso).getTime()
    if (!then) return ''
    const s = Math.max(0, Math.floor((Date.now() - then) / 1000))
    if (s < 60) return 'just now'
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const d = Math.floor(h / 24)
    if (d < 7) return `${d}d ago`
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

module.exports = { getNews, REGIONS, DEFAULT_REGION, regionByCode, timeAgo }
