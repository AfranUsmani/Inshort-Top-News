const express = require('express')
const newsRouter = express.Router()
require('dotenv').config()

const { getNews, REGIONS, DEFAULT_REGION, regionByCode, timeAgo } = require('../services/news')

// Homepage + region browse + search — all via GET so URLs are shareable.
// /            -> default region
// /?region=us  -> that country's feed
// /?q=bitcoin  -> keyword search (takes priority over region)
newsRouter.get('', async (req, res) => {
    const search = req.query.q ? String(req.query.q).trim() : ''
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
        res.render('news', { ...locals, articles })
    } catch (err) {
        logError(err)
        res.render('news', { ...locals, articles: [] })
    }
})

// Backward-compat: old POST search form -> redirect to the GET URL.
newsRouter.post('', (req, res) => {
    const q = req.body.search ? String(req.body.search).trim() : ''
    res.redirect(q ? `/?q=${encodeURIComponent(q)}` : '/')
})

function logError(err) {
    if (err.response) console.log('NewsAPI error', err.response.status, err.response.data)
    else if (err.request) console.log('NewsAPI: no response received')
    else console.error('Error', err.message)
}

module.exports = newsRouter
