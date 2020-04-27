class Room {
    constructor(id, name, nbr) {
        this.id = id;
        this.name = name;
        this.playersNbr = nbr;
        this.players = [];
    }

    newPlayer = (playerId, playerName) => {
        let player = {id: playerId, name: playerName}
        this.players.push(player);
        return player;
    }
}

module.exports = {Room};
