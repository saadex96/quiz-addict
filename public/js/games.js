const gamesList = document.querySelector('.games-list-ul');
const gamesListCont = document.querySelector('.games-list-container');
const container = document.querySelector('#player-view');
const loader = document.querySelector('.player.loader-container');
const formJoin = document.querySelector('.form-join-game');
const playerBoardGame = document.querySelector('.player-board-game');
const options = document.querySelectorAll('.player-board-game .option');

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

const createLiRoom = (el) => {
    let li = document.createElement("LI");
    li.classList.add('game-li');
    let text = document.createTextNode(el.name);
    let span = document.createElement("SPAN");
    span.appendChild(text);
    li.appendChild(span);
    li.dataset.name = el.name;
    li.dataset.id = el.id;
    li.addEventListener('click', () => {
        container.removeChild(gamesListCont);
        formJoin.style.display = "flex";
        formJoin.addEventListener('submit', (e) => {
            e.preventDefault();
            let player = {
                name: e.target.name.value,
                password: e.target.password.value,
                roomId: li.getAttribute('data-id')
            };
            socket.emit('join-room', player, (data) => {
                if (data.code === 'ok') {
                    container.removeChild(formJoin);
                    loader.style.display = 'flex';
                } else {
                    handleErrors(data.msg, formJoin);
                }
            });
        })
    })
    gamesList.appendChild(li);
}
