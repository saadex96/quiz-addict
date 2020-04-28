const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/routes');

const { Room } = require("./utils/room");

app.use(express.static('public'));
app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'ejs');

let rooms = [];

io.on('connection', (socket) => {

    /* Envoyer les rooms au client */
    socket.emit('send-rooms', rooms.filter(el => el.isFull === false))

    /* Créer une nouvelle room */
    socket.on('create-room', (data) => {
        let room = new Room(socket.id, data.name, data.number)
        socket.join(room.id);
        rooms.push(room);
        socket.emit('room-created', room);
        io.emit('new-room', room);
    })

    /* Rejoindre une room */
    socket.on('join-room', (playerData) => {
        let roomToJoin = rooms.find(el => el.id === playerData.roomId );
        let playersLength = roomToJoin.players.length + 1;
        let playersNbr = parseInt(roomToJoin.playersNbr);
        socket.join(roomToJoin.id);
            if (playersLength <= playersNbr) {
                let player = roomToJoin.newPlayer(socket.id, playerData.name);
                io.to(playerData.roomId).emit('player-join', player);
                if (playersLength === playersNbr) {
                    io.emit('delete-room', roomToJoin.id);
                    roomToJoin.isFull = true;
                    io.to(roomToJoin.id).emit('players-ready');
                };
            }
    })

    /* Démarrer une partie */
    socket.on('start-game', (roomId) => {
        let currentRoom = rooms.find(el => el.id === roomId );
        currentRoom.newQuestion(currentRoom, io);
    })

    /* Vérifier les réponses */
    socket.on('check-answer', (playerData) => {
        let room = rooms.find(el => el.id === playerData.roomId );
        room.checkResponse(playerData.answer, socket.id);
        if (room.allPlayersResponded()) {
            io.to(room.id).emit('update-game', {players: room.players, correctAnswer: room.currentAnswer});
            setTimeout(() => room.newQuestion(room, io), 6000);
        };
    })

    /* Gérer les déconnexions */
    socket.on('disconnect', () => {
        let room = rooms.find(el => el.id === socket.id);
        if (room) {
            deleteRoom(room);
        }
    });
});

const deleteRoom = (room) => {
    let roomIndex = rooms.indexOf(room);
    let roomId = room.id;
    rooms.splice(roomIndex, 1);
    io.emit('delete-room', roomId);
}

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})