var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
})

router.get('/main-game', function (req, res) {
    res.render('main-game.ejs');
})

router.get('/join-game', function (req, res) {
    res.render('join-game.ejs');
})

module.exports = router;
