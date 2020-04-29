const formNG = document.querySelector('.form-new-game');
const titleMG = document.querySelector('.main-game-title');
const mainGame = document.querySelector('.main-game-container');
const playersConUl = document.querySelector('.players-container-ul');
const loader = document.querySelector('.loader-container');
const quizContainer = document.querySelector('.quiz-container')

let roomId;

if (formNG) {
    formNG.addEventListener('submit', (e) => {
        e.preventDefault();

        let room = {};
        room.name = e.target.name.value;
        room.number = e.target.number.value;
        room.password = e.target.password.value;

        socket.emit('create-room', room,  (data) => {
            if (data.code === 'ok') {
                formNG.style.display = 'none';
                mainGame.style.display = 'flex';
                titleMG.innerHTML += data.room.name;
                roomId = data.room.id;
            } else {
                console.log(data.msg)
            }
        });
    })
}

socket.on('player-join', (player) => {
    let li = document.createElement("LI");
    li.classList.add('player-li');
    li.dataset.playerId = player.id;
    let span = document.createElement('SPAN');
    let spanScore = document.createElement('SPAN');
    spanScore.classList.add('player-score');
    let text = document.createTextNode(player.name);
    let score = document.createTextNode(player.score);
    span.appendChild(text);
    spanScore.appendChild(score);
    li.appendChild(span);
    li.appendChild(spanScore);
    playersConUl.appendChild(li);
})

socket.on('players-ready', () => {
    socket.emit('start-game', roomId, (data) => {
        if (data.code === 'ok') {
            mainGame.removeChild(loader);
        } else {
            console.log(data.msg)
        }
    });
})

socket.on('new-question', (question) => {
    createQuestion(question, quizContainer, false);
})

socket.on('update-game', (updatedGame) => {
        setTimeout(() => {
            let answer = document.querySelector(`[data-answer='${updatedGame.correctAnswer}']`);
            answer.classList.add('correct-option');
            updatePlayers(updatedGame.players);
        }, 1300)

})

const updatePlayers = (players) => {
    players.map(player => {
        let score = document.querySelector(`[data-player-id='${player.id}'] .player-score`);
        console.log(score)
        score.textContent = player.score;
    })
}