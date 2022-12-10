const express = require('express')
const { getMessages } = require('./message.controller')

const router = express.Router()

router.get('/', getMessages)

module.exports = router