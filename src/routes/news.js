const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')
require('dotenv').config()

const { enhance } = require('../services/ai')

const apiKey = process.env.API_KEY
const HTTP = { timeout: 6000 }

// Latest India news (NewsAPI's top-headlines?country=in currently returns
// no sources, so use the /everything endpoint sorted by most recent)
newsRouter.get('', async (req, res) => {
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=india&language=en&sortBy=publishedAt&apiKey=${apiKey}`, HTTP)
        const { items, briefing, aiEnabled } = await enhance(newsAPI.data.articles)
        res.render('news', { articles: items, briefing, aiEnabled, query: null })
    } catch (err) {
        logError(err)
        res.render('news', { articles: [], briefing: null, aiEnabled: false, query: null })
    }
})

// Keyword search
newsRouter.post('', async (req, res) => {
    const search = req.body.search
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`, HTTP)
        const { items, briefing, aiEnabled } = await enhance(newsAPI.data.articles)
        res.render('news', { articles: items, briefing, aiEnabled, query: search })
    } catch (err) {
        logError(err)
        res.render('news', { articles: [], briefing: null, aiEnabled: false, query: search })
    }
})

function logError(err) {
    if (err.response) {
        console.log(err.response.data)
        console.log(err.response.status)
        console.log(err.response.headers)
    } else if (err.request) {
        console.log(err.request)
    } else {
        console.error('Error', err.message)
    }
}

module.exports = newsRouter
