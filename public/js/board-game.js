const formNG = document.querySelector('.form-new-game');
const titleMG = document.querySelector('.main-game-title');
const mainGame = document.querySelector('.main-game-container');
const playersConUl = document.querySelector('.players-container-ul');
const loader = document.querySelector('.loader-container');
const quizContainer = document.querySelector('.quiz-container');
const header = document.querySelector('.header');
const mainCont = document.querySelector('.main-container');
const gameCont = document.querySelector('.game-container');

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
                createBoardGame(formNG, mainGame, titleMG, gameCont, header, mainCont, data);
            } else {
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

socket.on('loading', (i) => {
    loadingTimer(i, quizContainer);
})

socket.on('new-question', (question) => {
    createQuestion(question, quizContainer, false);
})

socket.on('timer', (time) => {
    updateTimer(time);
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

socket.on('question-coming', () => {
    quizContainer.innerHTML = '';

    let span = document.createElement('SPAN');
    span.classList.add('next-question');
    span.appendChild(document.createTextNode('Voilà la nouvelle question !!!'))

    quizContainer.appendChild(span);

})

socket.on('end-game', () => {
    quizContainer.innerHTML = '';

    let h3 = document.createElement('H3');
    let title = document.createTextNode('Partie terminée !!!');

    h3.appendChild(title);
    h3.classList.add('legend');

    quizContainer.appendChild(h3);
})
