const formNG = document.querySelector('.form-new-game');
const titleMG = document.querySelector('.main-game-title');
const mainGame = document.querySelector('.main-game-container');

if (formNG) {
    formNG.addEventListener('submit', (e) => {
        e.preventDefault();
        socket.emit('create-game', e.target.name.value);
    })
}

socket.on('room-created', (room) => {
    formNG.style.display = 'none';
    mainGame.style.display = 'flex';
    titleMG.innerHTML += room.name;
})

socket.on('player-join', (name) => {
    console.log('a player join ' + name)
})