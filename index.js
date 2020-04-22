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
    console.log(socket.id)
    socket.on('create-game', (data) => {
        console.log(data)
        socket.join(data);
        socket.emit('room-created', data)
    })
});

http.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})