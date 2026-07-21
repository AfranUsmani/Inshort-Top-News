const express = require('express')
const newsRouter = express.Router()
require('dotenv').config()

const { getNews } = require('../services/news')

// Homepage: latest India news
newsRouter.get('', (req, res) => render(res, null))

// Keyword search
newsRouter.post('', (req, res) => render(res, req.body.search))

async function render(res, rawQuery) {
    const query = rawQuery ? String(rawQuery).trim() : null
    try {
        const articles = await getNews(query)
        res.render('news', { articles, query })
    } catch (err) {
        logError(err)
        res.render('news', { articles: [], query })
    }
}

function logError(err) {
    if (err.response) console.log('NewsAPI error', err.response.status, err.response.data)
    else if (err.request) console.log('NewsAPI: no response received')
    else console.error('Error', err.message)
}

module.exports = newsRouter
