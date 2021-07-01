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
        this.endGame = 5;
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

        let random = Math.floor(Math.random() * 23) + 1;
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
            let answer = this.players.findIndex(el => (el.currentResponse === player.currentResponse) && (el.name !== player.name));
            if (answer !== -1 && player.currentResponse !== null) {
                const samePlayers = getAllIndexes(this.players, player.currentResponse);
                for (let index = 0; index < samePlayers.length; index++) {
                    if(this.players[index].isRight === null || this.players[index].isRight === false ) {
                        this.players[index].isRight = true;
                        this.players[index].score += 10;
                    }
                }
            } else {
                player.isRight = false;
            }
        }
    }

    allPlayersResponded = () => {
        if (this.responseNumber === this.players.length) {
            return true;
        }
    }
}
function getAllIndexes(arr, currentResponse) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i].currentResponse === currentResponse)
            indexes.push(i);
    return indexes;
}

module.exports = {Room};
