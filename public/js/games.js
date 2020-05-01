const gamesList = document.querySelector('.games-list-ul');
const gamesListCont = document.querySelector('.games-list-container');
const container = document.querySelector('#player-view');
const loader = document.querySelector('.player.loader-container');
const formJoin = document.querySelector('.form-join-game');
const playerBoardGame = document.querySelector('.player-board-game');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');
const character = document.querySelector('#character');
const characterInput = document.querySelector('#character-input');

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

/* Carousel */

let i = 1;

rightArrow.addEventListener('click', () => {
    i++;
    if (i >= 5) i = 1;
    character.setAttribute('src', `/images/assets/characters/zombie${i}/idle/1.png`);
    characterInput.value = `/images/assets/characters/zombie${i}/idle/1.png`;
})

leftArrow.addEventListener('click', () => {
    i--;
    if (i <= 0) i = 4;
    character.setAttribute('src', `/images/assets/characters/zombie${i}/idle/1.png`);
    characterInput.value = `/images/assets/characters/zombie${i}/idle/1.png`;
})

