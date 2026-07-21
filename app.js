const express = require('express')
const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')

// Express loads the view engine dynamically; require it explicitly so
// Vercel's file tracer bundles it into the serverless function.
require('ejs')

const app = express()
const port = process.env.PORT || 5000

app.set('trust proxy', 1)
app.disable('x-powered-by')

// Security headers. CSP allows Google Fonts + same-origin scripts and any
// https image (news thumbnails come from many domains).
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}))

// Request logging (streams to Vercel logs in production)
app.use(morgan('tiny'))

// Static files (also served by Vercel from /public), cached at the edge/browser
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d', etag: true }))

// Templating engine
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// Health check for uptime monitoring
app.get('/healthz', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }))

// Routes
const newsRouter = require('./src/routes/news')
app.use('/', newsRouter)

// 404
app.use((req, res) => res.status(404).render('notfound'))

// Start a listener only when run directly (local / Procfile). When imported by a
// serverless handler, the app is used as the request handler instead.
if (require.main === module) {
    app.listen(port, () => console.log(`Listening on port ${port}`))
}

module.exports = app
