const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/routes');

app.use(express.static('public'));
app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'ejs');

let rooms = []

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.emit('send-rooms', rooms)

    socket.on('create-game', (data) => {
        socket.join(data);
        rooms.push(data)
        console.log(rooms)
        socket.emit('room-created', data)
        io.emit('new-room', data)
    })

    socket.on('join-game', (name) => {
        io.to(name).emit('player-join', name);
    })
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})