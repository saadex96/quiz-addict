class Room {
    constructor(id, name, nbr) {
        this.id = id;
        this.name = name;
        this.playersNbr = nbr;
        this.players = [];
        this.questions = [];
        this.currentAnswer;
        this.isFull = false;
    }

    newPlayer = (playerId, playerName) => {
        let player = {id: playerId, name: playerName}
        this.players.push(player);
        return player;
    }

    newQuestion = (question) => {
        this.questions.push(question);
        this.currentAnswer = question.answer;
    }
}

module.exports = {Room};
