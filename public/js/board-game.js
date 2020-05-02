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
                handleErrors(data.msg, formNG);
            }
        });
    })
}

socket.on('player-join', (player) => {
    createPlayer(player, playersConUl);
})

socket.on('players-ready', () => {
    socket.emit('start-game', roomId, (data) => {
        if (data.code === 'ok') {
            mainGame.removeChild(loader);
        } else {
            handleErrors(data.msg, mainGame);
        }
    });
})

socket.on('new-question', (question) => {
    createQuestion(question, quizContainer, false);
})

socket.on('update-game', (updatedGame) => {
        setTimeout(() => {
            if (updatedGame.correctAnswer !== null) {
                let answer = document.querySelector(`[data-answer='${updatedGame.correctAnswer}']`);
                answer.classList.add('correct-option');
                updatePlayers(updatedGame.players);
            }
        }, 1300)

})

socket.on('timer', (timer) => {
    console.log(timer);
})

const updatePlayers = (players) => {
    players.map(player => {
        let score = document.querySelector(`[data-player-id='${player.id}'] .player-score`);
        console.log(score)
        score.textContent = player.score;
    })
}