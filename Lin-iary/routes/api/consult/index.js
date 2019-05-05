const express = require('express')
const router = express.Router()

router.use('/', require('./consult'))

module.exports = router