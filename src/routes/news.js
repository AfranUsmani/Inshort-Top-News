const express = require('express')
const newsRouter = express.Router()
require('dotenv').config()

const { getNews, REGIONS, DEFAULT_REGION, regionByCode, timeAgo } = require('../services/news')

// Homepage + region browse + search — all via GET so URLs are shareable.
// /            -> default region
// /?region=us  -> that country's feed
// /?q=bitcoin  -> keyword search (takes priority over region)
const MAX_QUERY_LEN = 100

newsRouter.get('', async (req, res) => {
    const search = req.query.q ? String(req.query.q).trim().slice(0, MAX_QUERY_LEN) : ''
    const region = regionByCode(req.query.region ? String(req.query.region) : DEFAULT_REGION)

    const locals = {
        query: search || null,
        regions: REGIONS,
        activeRegion: region.code,
        activeRegionLabel: region.label,
        timeAgo,
    }

    try {
        const articles = await getNews({ region: region.code, search })
        res.render('news', { ...locals, articles, error: false })
    } catch (err) {
        logError(err)
        res.render('news', { ...locals, articles: [], error: true })
    }
})

// Backward-compat: old POST search form -> redirect to the GET URL.
newsRouter.post('', (req, res) => {
    const q = req.body.search ? String(req.body.search).trim().slice(0, MAX_QUERY_LEN) : ''
    res.redirect(q ? `/?q=${encodeURIComponent(q)}` : '/')
})

function logError(err) {
    console.error('News feed error:', err.message)
}

module.exports = newsRouter
