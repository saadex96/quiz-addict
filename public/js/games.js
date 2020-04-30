const gamesList = document.querySelector('.games-list-ul');
const gamesListCont = document.querySelector('.games-list-container');
const container = document.querySelector('#player-view');
const loader = document.querySelector('.player.loader-container');
const formJoin = document.querySelector('.form-join-game');
const playerBoardGame = document.querySelector('.player-board-game');

socket.on('send-rooms', (rooms) => {
    if (rooms != undefined) {
        rooms.map(el => {
            createLiRoom(el)
        })
    }
})

socket.on('new-room', (room) => {
    createLiRoom(room)
})

socket.on('players-ready', () => {
    container.removeChild(loader);
})

socket.on('new-question', (question) => {
    createQuestion(question, playerBoardGame, true);
})

socket.on('update-game', () => {
    playerBoardGame.removeChild(document.querySelector('.question-container'));
})

socket.on('delete-room', (roomId) => {
    let roomToDelete = document.querySelector(`[data-id='${roomId}']`);
    if (roomToDelete) {
        gamesList.removeChild(roomToDelete);
    }
})
