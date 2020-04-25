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

let rooms = [];

io.on('connection', (socket) => {
    console.log(socket.id)

    /* Envoyer les rooms au client */
    socket.emit('send-rooms', rooms)

    /* Créer une nouvelle room */
    socket.on('create-room', (name) => {
        let game = new Room(socket.id, name)
        socket.join(socket.id);
        rooms.push(game);
        socket.emit('room-created', game);
        io.emit('new-room', game);
    })

    /* Rejoindre une room */
    socket.on('join-room', (room) => {
        let roomToJoin = rooms.find(el => el.id === room );
        roomToJoin.newPlayer(socket.id);
        io.to(room).emit('player-join', socket.id);
    })

    /* Gérer les déconnexions */
    socket.on('disconnect', () => {
        let room = rooms.find(el => el.id === socket.id);
        if (room) {
            let roomIndex = rooms.indexOf(room);
            rooms.splice(roomIndex, 1);
            io.emit('delete-room', socket.id)
        }
    });
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})