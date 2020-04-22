const express = require('express');
const app = express();
const routes = require('./routes/routes');

app.use(express.static('public'));
app.use('/', routes);

app.set('views', './views');
app.set('view engine', 'ejs');



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})