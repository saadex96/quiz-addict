const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/routes');

const { Room } = require("./utils/game");

app.use(express.static('public'));
app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'ejs');

let rooms = []

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.emit('send-rooms', rooms)

    socket.on('create-game', (name) => {
        let game = new Room(socket.id, name)
        socket.join(socket.id);
        rooms.push(game);
        console.log(rooms);
        socket.emit('room-created', game);
        io.emit('new-room', game);
    })

    socket.on('join-game', (room) => {
        let roomToJoin = rooms.find(el => el.id == room );
        roomToJoin.newPlayer(socket.id);
        console.log(rooms);
        io.to(room).emit('player-join', room);
    })
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})