const express = require('express');
const app = express();
const fs = require('fs');

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended:false}))

const tasks = require("./routes/tasks");

app.set("view engine", "pug");

app.use("/tasks", tasks);

app.get('/', (req, res) => {
    res.render('main');
});

app.listen('8000', (error) => {
    if (error) throw error;

    console.log("Application running on port 8000");
});