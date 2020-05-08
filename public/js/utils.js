const createQuestion = (question, boardGame, status) => {

    boardGame.innerHTML = "";

    let timerContainer = document.createElement('DIV');
    timerContainer.classList.add('timer-container');

    let timer = document.createElement('DIV');
    timer.classList.add('timer');

    timerContainer.appendChild(timer);

    let div = document.createElement("DIV");
    div.classList.add('question-container');
    div.appendChild(timerContainer);

    let h3 = document.createElement("H3");
    h3.classList.add('question');

    let questionBody = document.createTextNode(question.question);
    h3.appendChild(questionBody);
    div.appendChild(h3);

    let ul = document.createElement("UL");
    ul.classList.add('option-container');

    question.options.map((el, index) => {
        let li = document.createElement("LI");
        li.classList.add('option', 'option-' + index);
        li.dataset.answer = el;

        let option = document.createTextNode(el);

        li.appendChild(option);
        ul.appendChild(li);
        if (status) {
            li.addEventListener('click', () => {
                socket.emit('check-answer', {answer: el, roomId: question.roomId}, (data) => {
                    if (data.code === 'error') {
                        handleErrors(data.msg, boardGame);
                    } else {
                        console.log(data.answer)
                        ul.style.display = 'none';
                        let playerAnswer = document.createTextNode(data.answer);
                        let span = document.createElement('SPAN');
                        span.appendChild(playerAnswer);
                        span.classList.add('option');
                        div.appendChild(span);
                    }
                })
            })
        }
    })
    div.appendChild(ul);
    boardGame.appendChild(div);
}

const createBoardGame = (formNG, mainGame, titleMG, gameCont, header, mainCont, data) => {
    mainGame.style.display = 'flex';
    mainGame.style.height = "100vh";
    titleMG.innerHTML += data.room.name;
    roomId = data.room.id;
    gameCont.removeChild(formNG);
    gameCont.style.padding = '0';
    if (header) {
        mainCont.removeChild(header);
    }
}

const createPlayer = (player, container) => {
    let li = document.createElement("LI");
    li.classList.add('character-cont');
    li.dataset.playerId = player.id;

    let div = document.createElement('DIV');
    div.classList.add('player-li');

    let span = document.createElement('SPAN');

    let spanScore = document.createElement('SPAN');
    spanScore.classList.add('player-score');

    let text = document.createTextNode(player.name);
    let score = document.createTextNode(player.score);

    let img = document.createElement('IMG');
    img.classList.add('character-img');
    img.setAttribute('src', player.character);
    img.setAttribute('alt', 'personnage');

    span.appendChild(text);
    spanScore.appendChild(score);
    div.appendChild(span);
    div.appendChild(spanScore);
    li.appendChild(div);
    li.appendChild(img);
    container.appendChild(li);
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
                character: e.target.character.value,
                roomId: li.getAttribute('data-id')
            };
            socket.emit('join-room', player, (data) => {
                if (data.code === 'ok') {
                    container.removeChild(formJoin);
                    loader.style.display = 'flex';
                } else {
                    handleErrors(data.msg, formJoin);
                }
            });
        })
    })
    gamesList.appendChild(li);
}


const handleErrors = (error, container) => {
    removeErrors();
    let div = document.createElement('DIV');
    div.classList.add('errors-container', 'alert', 'alert-dismissible', 'alert-light');

    let text = document.createTextNode(error);

    div.appendChild(text);
    container.appendChild(div);
}


const removeErrors = () => {
    let errorsCont = document.querySelector('.errors-container');
    let errorsContChild = document.querySelector('.errors-container > *');
    if (errorsCont) {
        errorsCont.remove(errorsContChild);
    }
}


const updatePlayers = (players) => {
    players.map(player => {
        let score = document.querySelector(`[data-player-id='${player.id}'] .player-score`);
        score.textContent = player.score;
    })
}


const updateTimer = (time) => {
    const timer = document.querySelector('.timer');
    let size = (20 - time) / 20 * 100;

    if(timer) {
        timer.style.width = size + '%';
    }
}

const loadingTimer = (i, quizContainer) => {
    let span = document.createElement('SPAN');

    if (i === 8) {
        span.classList.add('loading');
        span.appendChild(document.createTextNode('Vous êtes prêts ?!'));
    } else if (i === 6) {
        quizContainer.innerHTML = '';
        span.classList.add('loading');
        span.appendChild(document.createTextNode('C\'est parti !'));
    } else if (i <= 4 && i > 1) {
        quizContainer.innerHTML = '';
        if (i === 4) span.classList.add('loading','number', 'green');
        if (i === 3 ) span.classList.add('loading','number', 'orange');
        if (i === 2) span.classList.add('loading','number', 'red');
        let number = i - 1;
        span.appendChild(document.createTextNode(number));
    } else if (i === 1) {
        quizContainer.innerHTML = '';
        span.classList.add('loading','number', 'red');
        span.appendChild(document.createTextNode('GO !'))
    } else if (i === 0) {
        quizContainer.removeChild(document.querySelector('.loading.number.red'));
    }
    quizContainer.appendChild(span);
}