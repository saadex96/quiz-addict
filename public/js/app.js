const formNG = document.querySelector('.form-new-game');

if (formNG) {
    formNG.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target.name.value);
        socket.emit('create-game', e.target.name.value)
    })
}

socket.on('room-created', (data) => {
    console.log('data ' + data)
    formNG.style.display = 'none'
})