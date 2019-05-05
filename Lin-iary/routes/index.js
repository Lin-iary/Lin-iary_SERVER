const express = require('express')
const router = express.Router()

router.use('/upload', require('./api/upload/index'))

module.exports = router
