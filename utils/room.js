const questions = require('../utils/questions.json');

class Room {
    constructor(id, name, password, nbr) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.playersNbr = nbr;
        this.players = [];
        this.questions = [];
        this.currentAnswer = null;
        this.isFull = false;
        this.responseNumber = 0;
        this.endGame = 2;
    }

    newPlayer = (playerId, playerName, playerCharacter) => {
        let player = {id: playerId, name: playerName, character: playerCharacter, currentResponse: '', score: 0, isRight: null}
        this.players.push(player);
        return player;
    }

    newQuestion = () => {
        this.endGame --;
        this.players.map(el => {
            el.currentResponse = null
        })
        this.responseNumber = 0;

        let random = Math.floor(Math.random() * 7) + 1;
        let cQuestion = questions.quiz[random];
        this.questions.push(cQuestion);
        this.currentAnswer = cQuestion.answer;

        let data = [cQuestion.question, cQuestion.options, this.id];

        return data;
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
            player.score += 10;
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
