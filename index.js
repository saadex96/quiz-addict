const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/routes');
const helmet = require('helmet');
const { Room } = require("./utils/room");

app.use(express.static('public'));
app.use('/', routes);
app.use(helmet());

app.disable('x-powered-by');

app.set('views', './views');
app.set('view engine', 'ejs');

let rooms = [];
let timer;

io.on('connection', (socket) => {

    /* Envoyer les rooms au client */
    socket.emit('send-rooms', rooms.filter(el => el.isFull === false))

    /* Créer une nouvelle room */
    socket.on('create-room', (data, callback) => {
        // TODO Password
        if (data.number >= 2 && data.number<= 6) {
            if(data.name.length >= 3 && data.name.length <= 35) {
                let room = new Room(socket.id, data.name, data.password, data.number);
                socket.join(room.id);
                rooms.push(room);
                io.emit('new-room', room);
                callback({code: 'ok', msg: "room-created", room: room});
            } else {
                callback({code: 'error', msg: 'Le nom est doit être supérieur à 3 caractères et inférieur à 35 caractères'});
            }
        } else {
            callback({code: 'error', msg: 'Le nombre de joueurs doit être supérieur à 2 et inférieur à 6'});
        }

    })

    /* Rejoindre une room */
    socket.on('join-room', (playerData, callback) => {
        // A faire les else
        let roomToJoin = rooms.find(el => el.id === playerData.roomId );
        if (roomToJoin !== undefined) {
            let playersLength = roomToJoin.players.length + 1;
            let playersNbr = parseInt(roomToJoin.playersNbr);
            socket.join(roomToJoin.id);
            if (playersLength <= playersNbr) {
                if(playerData.password === roomToJoin.password) {
                    if (playerData.name.length >= 2 && playerData.name.length <= 10) {
                        let player = roomToJoin.newPlayer(socket.id, playerData.name, playerData.character);
                        io.to(playerData.roomId).emit('player-join', player);
                        callback({code: 'ok', msg: 'Room disponible'});
                        if (playersLength === playersNbr) {
                            io.emit('delete-room', roomToJoin.id);
                            roomToJoin.isFull = true;
                            io.to(roomToJoin.id).emit('players-ready');
                        }
                    } else {
                        callback({code: 'error', msg: 'Le nom est doit être supérieur à 2 caractères et inférieur à 10 caractères.'});
                    }
                } else {
                    callback({code: 'error', msg: 'Le mot de passe ne correspond pas.'});
                }
            } else {
                callback({code: 'error', msg: 'Room non disponible.'});
            }
        } else {
            callback({code: 'error', msg: 'La room n\'existe pas.'});
        }
    })

    /* Démarrer une partie */
    socket.on('start-game', (roomId, callback) => {
        let currentRoom = rooms.find(el => el.id === roomId );
        if (currentRoom) {
            callback({code: 'ok', msg: 'game-started'})
            askQuestion(currentRoom);
        } else {
            callback({code: 'error', msg: 'la room n\'existe pas'})
        }
    })

    /* Vérifier les réponses */
    socket.on('check-answer', (playerData, callback) => {
        let room = rooms.find(el => el.id === playerData.roomId );
        if (room) {
            room.checkResponse(playerData.answer, socket.id);
            if (room.allPlayersResponded()) {
                askQuestion(room);
            }
        } else {
            callback({code: 'error', msg: 'La room n\'existe pas'});
        }
    })

    /* Gérer les déconnexions */
    socket.on('disconnect', () => {
        let room = rooms.find(el => el.id === socket.id);
        if (room) {
            io.to(room.id).emit('room-disconnected');
            deleteRoom(room);
        }
    });
});

const askQuestion = (room) => {
    stopTimer();
    io.to(room.id).emit('update-game', {players: room.players, correctAnswer: room.currentAnswer});
    setTimeout(() => {
        if (room.endGame !== 0) {
        let question = room.newQuestion();
        io.to(room.id).emit('new-question', {
            question: question[0],
            options: question[1],
            roomId: question[2]
        });
        startTimer(room);
        } else {
            io.to(room.id).emit('end-game', room);
        }
    }, 5000);
}

const startTimer = (room) => {
    let i = 30;
    timer = setInterval(() => {
        io.to(room.id).emit('timer', i);
        i--;
        if (i === -1) {
            stopTimer();
            askQuestion(room);
        }
    }, 1000)
}

const stopTimer = () => {
    clearInterval(timer);
}

const deleteRoom = (room) => {
    let roomIndex = rooms.indexOf(room);
    let roomId = room.id;
    rooms.splice(roomIndex, 1);
    io.emit('delete-room', roomId);
}

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})