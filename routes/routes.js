var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index')
})

router.get('/nouvelle-partie', function (req, res) {
    res.render('newGame.ejs')
})

module.exports = router;
