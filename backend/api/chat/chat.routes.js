const express = require('express')
const { addChat, getChats, resetNotifications, addToGroupChat } = require('./chat.controller')

const router = express.Router()

router.get('/', getChats)
router.post('/add', addChat)
router.post('/reset', resetNotifications)
router.post('/addtochat', addToGroupChat)


module.exports = router