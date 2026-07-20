const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')
require('dotenv').config()

const apiKey = process.env.API_KEY

// Top headlines for India
newsRouter.get('', async (req, res) => {
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`)
        res.render('news', { articles: newsAPI.data.articles })
    } catch (err) {
        logError(err)
        res.render('news', { articles: null })
    }
})

// Keyword search
newsRouter.post('', async (req, res) => {
    const search = req.body.search
    try {
        const newsAPI = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&apiKey=${apiKey}`)
        res.render('newsSearch', { articles: newsAPI.data.articles })
    } catch (err) {
        logError(err)
        res.render('newsSearch', { articles: null })
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
