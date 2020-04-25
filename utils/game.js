class Room {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.players = [];
    }

    newPlayer = (player) => {
        this.players.push(player);
    }
}

module.exports = {Room};
