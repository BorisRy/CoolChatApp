const express = require('express')
const { addChat, getChats, resetNotifications } = require('./chat.controller')

const router = express.Router()

router.get('/', getChats)
router.post('/add', addChat)
router.post('/reset', resetNotifications)


module.exports = router