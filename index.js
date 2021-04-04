const express = require('express');
const app = express();

app.use('/static', express.static('public'))

app.set("view engine", "pug");

app.get('/', (req, res) => {
    res.render('main');
});

app.listen('8000', (error) => {
    if (error) throw error;

    console.log("Application running on port 8000");
});
