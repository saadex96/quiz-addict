const questions = require('../utils/questions.json');

class Room {
    constructor(id, name, nbr) {
        this.id = id;
        this.name = name;
        this.playersNbr = nbr;
        this.players = [];
        this.questions = [];
        this.currentAnswer = null;
        this.isFull = false;
        this.responseNumber = 0;
    }

    newPlayer = (playerId, playerName) => {
        let player = {id: playerId, name: playerName, currentResponse: '', score: 0, isRight: null}
        this.players.push(player);
        return player;
    }

    newQuestion = (room, io) => {
        this.players.map(el => {
            el.currentResponse = null
        })
        this.responseNumber = 0;

        let random = Math.floor(Math.random() * (3 - 1) + 1);
        let question = questions.quiz[random];
        this.questions.push(question);
        this.currentAnswer = question.answer;

        io.to(room.id).emit('new-question', {
            question: questions.quiz[random].question,
            options: questions.quiz[random].options,
            roomId: room.id
        });
    }

    checkResponse = (answer, socketId) => {
        let player = this.players.find(el => el.id === socketId);
        if (player.currentResponse === null) {
            player.currentResponse = answer;
            this.responseNumber ++;
        } else {
            return false
        }

        if (player.currentResponse === this.currentAnswer) {
            player.score ++;
            player.isRight = true;
        } else {
            player.isRight = false;
        }
    }

    allPlayersResponded = () => {
        if (this.responseNumber === this.players.length) {
            return true;
        }
    }
}

module.exports = {Room};
