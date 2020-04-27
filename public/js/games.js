const gamesList = document.querySelector('.games-list-ul');
const gamesListCont = document.querySelector('.games-list-container');
const container = document.querySelector('#player-view');
const loader = document.querySelector('.player.loader-container');
const formJoin = document.querySelector('.form-join-game');
const playerBoardGame = document.querySelector('.player-board-game');

socket.on('send-rooms', (rooms) => {
    rooms.forEach(el => {
        createLiRoom(el)
    })
})

socket.on('new-room', (room) => {
    createLiRoom(room)
})

socket.on('new-question', (question) => {
    container.removeChild(loader);
    createQuestion(question);
})

socket.on('delete-room', (roomId) => {
    let roomToDelete = document.querySelector(`[data-id='${roomId}']`);
    if (roomToDelete) {
        gamesList.removeChild(roomToDelete);
    }
})

const createQuestion = (question) => {
    let div = document.createElement("DIV");
    let h3 = document.createElement("H3");
    let questionBody = document.createTextNode(question.question);
    h3.appendChild(questionBody);
    div.appendChild(h3);
    let ul = document.createElement("UL");

    question.options.map(el => {
        let li = document.createElement("LI");
        let option = document.createTextNode(el);
        li.appendChild(option);
        ul.appendChild(li);
    })

    div.appendChild(ul);
    playerBoardGame.appendChild(div);
}

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
            socket.emit('join-room', player);
            container.removeChild(formJoin);
            loader.style.display = 'flex';
        })
    })
    gamesList.appendChild(li);
}
