var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
})

router.get('/board-game', function (req, res) {
    res.render('board-game.ejs');
})

router.get('/buzzer', function (req, res) {
    res.render('buzzer.ejs');
})

module.exports = router;
