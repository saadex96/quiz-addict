const formNG = document.querySelector('.form-new-game');
const titleMG = document.querySelector('.main-game-title');
const mainGame = document.querySelector('.main-game-container');
const playersConUl = document.querySelector('.players-container-ul')

if (formNG) {
    formNG.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('create-room', e.target.name.value);
    })
}

socket.on('room-created', (room) => {
    formNG.style.display = 'none';
    mainGame.style.display = 'flex';
    titleMG.innerHTML += room.name;
})

socket.on('player-join', (name) => {
    let li = document.createElement("LI");
    li.classList.add('player-li');
    let text = document.createTextNode(name);
    li.appendChild(text);
    playersConUl.appendChild(li);
})