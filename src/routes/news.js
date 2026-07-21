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
        subscribed: req.query.subscribed === '1',
        subscribeError: req.query.subscribe === 'invalid' || req.query.subscribe === 'error'
            ? req.query.subscribe
            : null,
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

// Newsletter signup. Forwards to your email provider if NEWSLETTER_WEBHOOK is
// set (Buttondown/Mailchimp/Formspree/Zapier URL); otherwise logs the email.
newsRouter.post('/subscribe', async (req, res) => {
    const email = String(req.body.email || '').trim().slice(0, 200)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.redirect('/?subscribe=invalid')
    try {
        if (process.env.NEWSLETTER_WEBHOOK) {
            await fetch(process.env.NEWSLETTER_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
        } else {
            console.log('Newsletter signup:', email)
        }
        res.redirect('/?subscribed=1')
    } catch (err) {
        console.error('Subscribe error:', err.message)
        res.redirect('/?subscribe=error')
    }
})

function logError(err) {
    console.error('News feed error:', err.message)
}

module.exports = newsRouter
