const express = require('express')
const { addChat, getChats } = require('./chat.controller')

const router = express.Router()

router.get('/', getChats)
router.post('/add', addChat)


module.exports = router