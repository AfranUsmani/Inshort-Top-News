const express = require('express')
const newsRouter = express.Router()
const axios = require('axios')
require('dotenv').config()

newsRouter.get('', async(req, res) => {
    try {
        const apiKey= process.env.API_KEY;
        const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`)
        res.render('news', { articles : newsAPI.data.articles })
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
            res.render('news', { articles : null })
        } else if(err.requiest) {
            res.render('news', { articles : null })
            console.log(err.requiest)
        } else {
            res.render('news', { articles : null })
            console.error('Error', err.message)
        }
    } 
})

newsRouter.post('', async(req, res) => {
    let search = req.body.search
    try {
        const apiKey= process.env.API_KEY;
        const newsAPI = await axios.get(`https://newsapi.org/v2/top-headlines?country=${search}&apiKey=${apiKey}`)
        res.render('newsSearch', { articles : newsAPI.data.articles })
    } catch (err) {
        if(err.response) {
            res.render('newsSearch', { articles : null })
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
        } else if(err.requiest) {
            res.render('newsSearch', { articles : null })
            console.log(err.requiest)
        } else {
            res.render('newsSearch', { articles : null })
            console.error('Error', err.message)
        }
    } 
})


module.exports = newsRouter 