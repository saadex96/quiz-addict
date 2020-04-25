const gamesList = document.querySelector('.games-list-ul');
const gamesListCont = document.querySelector('.games-list-container');
const container = document.querySelector('#player-view');
const loader = document.querySelector('.player.loader-container');

socket.on('send-rooms', (rooms) => {
    rooms.forEach(el => {
        createLiRoom(el)
    })
})

socket.on('new-room', (room) => {
    createLiRoom(room)
})

socket.on('delete-room', (roomId) => {
    let roomToDelete = document.querySelector(`[data-id='${roomId}']`);
    if (roomToDelete) {
        gamesList.removeChild(roomToDelete);
    }
})

socket.on('start-game', () => {
    console.log('le jeu démarre')
})

const createLiRoom = (el) => {
    let li = document.createElement("LI");
    li.classList.add('game-li');
    let text = document.createTextNode(el.name);
    li.appendChild(text);
    li.dataset.name = el.name;
    li.dataset.id = el.id;
    li.addEventListener('click', () => {
        socket.emit('join-room', li.getAttribute('data-id'));
        console.log(li.getAttribute('data-id'))
        container.removeChild(gamesListCont);
        loader.style.display = 'flex'
    })
    gamesList.appendChild(li);
}
