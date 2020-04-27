const createQuestion = (question, boardGame) => {
    let div = document.createElement("DIV");
    let h3 = document.createElement("H3");
    let questionBody = document.createTextNode(question.question);
    h3.appendChild(questionBody);
    div.appendChild(h3);
    let ul = document.createElement("UL");

    question.options.map(el => {
        let li = document.createElement("LI");
        let option = document.createTextNode(el);
        li.appendChild(option);
        ul.appendChild(li);
    })

    div.appendChild(ul);
    boardGame.appendChild(div);
}