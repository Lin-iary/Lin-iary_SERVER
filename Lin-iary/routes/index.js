const express = require('express')
const router = express.Router()

// about auth
router.use('/api/auth', require('./api/auth/index'))

// diary
router.use('/api/diary', require('./api/diary/index'))
// consult
router.use('/api/consult', require('./api/consult/index'))
// counselor
router.use('/api/counselor', require('./api/counselor/index'))

router.use('/images', express.static('public/images'))
router.use('/images', express.static('public/info'))

module.exports = router