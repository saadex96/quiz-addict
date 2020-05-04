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

router.get('/connexion', function (req, res) {
    res.render('not-ready.ejs');
})

router.get('/inscription', function (req, res) {
    res.render('not-ready.ejs');
})

module.exports = router;
