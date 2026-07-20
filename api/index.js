// Vercel serverless entry point.
// Files under /api are auto-detected as serverless functions; an Express app
// is a valid (req, res) handler, so we simply re-export it.
module.exports = require('../app')
