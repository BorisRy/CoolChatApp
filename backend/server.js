const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require("cookie-parser");

const app = express();
const http = require('http').createServer(app)

app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const chatRoutes = require('./api/chat/chat.routes')
const messageRoutes = require('./api/message/message.routes')
const { setupSocketAPI } = require('./services/socket.service')

app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)
setupSocketAPI(http)

const port = process.env.PORT || 3030;

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

http.listen(port, () => {
    console.log('listening on *:3030');
});