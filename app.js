const express = require('express')
const path = require('path')

// Express loads the view engine dynamically; require it explicitly so
// Vercel's file tracer bundles it into the serverless function.
require('ejs')

const app = express()
const port = process.env.PORT || 5000

// Static files (also served automatically by Vercel from /public)
app.use(express.static(path.join(__dirname, 'public')))

// Templating engine
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Routes
const newsRouter = require('./src/routes/news')
app.use('/', newsRouter)

// Start a listener only when run directly (local / Procfile).
// When imported by a serverless handler, the app is used as the request handler instead.
if (require.main === module) {
    app.listen(port, () => console.log(`Listening on port ${port}`))
}

module.exports = app
