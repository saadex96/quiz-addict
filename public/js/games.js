const gamesList = document.querySelector('.games-list-ul')
const gameLi = document.querySelectorAll('.game-li')

socket.on('send-rooms', (rooms) => {
    rooms.forEach(el => {
        createLiRoom(el)
    })
})

socket.on('new-room', (room) => {
    createLiRoom(room)
})

const createLiRoom = (el) => {
    let li = document.createElement("LI");
    li.classList.add('game-li');
    let text = document.createTextNode(el);
    li.appendChild(text);
    li.dataset.name = el;
    li.addEventListener('click', () => {
        console.log(li.getAttribute('data-name'));
        socket.emit('join-game', li.getAttribute('data-name'))
    })
    gamesList.appendChild(li);
}
