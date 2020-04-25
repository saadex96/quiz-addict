class Room {
    constructor(id, name, nbr) {
        this.id = id;
        this.name = name;
        this.playersNbr = nbr;
        this.players = [];
    }

    newPlayer = (player) => {
        this.players.push(player);
    }
}

module.exports = {Room};
