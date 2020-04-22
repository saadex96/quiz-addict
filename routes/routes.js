var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
})

router.get('/creer-partie', function (req, res) {
    res.render('new-game.ejs');
})

module.exports = router;
