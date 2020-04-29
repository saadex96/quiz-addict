const createQuestion = (question, boardGame, status) => {
    let questionCont = document.querySelector('.question-container')

    if (questionCont != null) {
        boardGame.removeChild(questionCont)
    }

    let div = document.createElement("DIV");
    div.classList.add('question-container');
    let h3 = document.createElement("H3");
    h3.classList.add('title-h4');
    let questionBody = document.createTextNode(question.question);
    h3.appendChild(questionBody);
    div.appendChild(h3);
    let ul = document.createElement("UL");
    ul.classList.add('option-container');

    question.options.map(el => {
        let li = document.createElement("LI");
        li.classList.add('option');
        li.dataset.answer = el;
        let option = document.createTextNode(el);
        li.appendChild(option);
        ul.appendChild(li);
        if (status) {
            li.addEventListener('click', () => {
                socket.emit('check-answer', {answer: el, roomId: question.roomId}, (data) => {
                    if (data.code === 'error') {
                        console.log(data.msg)
                    }
                })
            })
        }
    })
    div.appendChild(ul);
    boardGame.appendChild(div);
}