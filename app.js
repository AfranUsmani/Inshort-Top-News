const express = require('express')

const app = express()
const port = process.env.PORT || 5000

// Static Files
app.use(express.static('public'))

// Templating Engine
app.set('views', './src/views')
app.set('view engine', 'ejs')

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Routes
const newsRouter = require('./src/routes/news')

app.use('/', newsRouter)

// Listen on port 5000
app.listen(port, () => console.log(`Listening on port ${port}`))