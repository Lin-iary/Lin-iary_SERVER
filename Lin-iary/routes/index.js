const express = require('express')
const router = express.Router()

// about auth
router.use('/api/auth', require('./api/auth/index'))

// diary
router.use('/api/diary', require('./api/diary/index'))

router.use('/image', express.static('public/images'))

module.exports = router