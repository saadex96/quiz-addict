const formNG = document.querySelector('.form-new-game');
const titleMG = document.querySelector('.main-game-title');
const mainGame = document.querySelector('.main-game-container');

if (formNG) {
    formNG.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target.name.value);
        socket.emit('create-game', e.target.name.value);
    })
}

socket.on('room-created', (data) => {
    console.log('data ' + data);
    formNG.style.display = 'none';
    mainGame.style.display = 'flex';
    titleMG.innerHTML += data;
})