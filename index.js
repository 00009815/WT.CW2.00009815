const express = require('express');
const app = express();
const fs = require('fs');

app.use('/static', express.static('public'))
app.use(express.urlencoded({extended:false}))

app.set("view engine", "pug");

app.get('/', (req, res) => {
    res.render('main');
});

app.get('/tasks/create', (req, res) => {
    res.render('create-task');
});

app.get('/tasks', (req, res) =>{
    res.render('tasks');
});

app.post('/tasks/create', (req, res) => {
	const title = req.body.title
	const description = req.body.description

	if(title.trim() == '' && description.trim() == '') {
		res.render('create-task', {error: true})
	} else{
		fs.readFile('./database/tasks.json', (err, data) => {
			if(err) throw err

			let tasks = JSON.parse(data)

			tasks.push({
                id: id(),
				title: title,
				description: description
			})

			fs.writeFile('./database/tasks.json', JSON.stringify(tasks), err => {
				if (err) throw err

				res.render('create-task', {success: true})
			})
		})
	}

});

app.get('/tasks', (req, res) => {

	fs.readFile('./database/tasks.json', (err, data) => {
		if(err) throw err

		const tasks = JSON.parse(data)

		res.render('tasks', { tasks: tasks })
	})
	

})

app.listen('8000', (error) => {
    if (error) throw error;

    console.log("Application running on port 8000");
});

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
