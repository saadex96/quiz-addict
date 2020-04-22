const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const routes = require('./routes/routes');

app.use(express.static('public'));
app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log('a user connected');
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})