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


const status = {
	toDo: 0,
	doing: 1,
	done: 2
}

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
				description: description,
				status: status.toDo,
				archive: false
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
		

		renderTasks(res, tasks)
	})
	

})

app.get('/tasks/:id/delete', (req, res) => {
	const id = req.params.id;

	fs.readFile('./database/tasks.json', (err, data) => {
		if (err) throw err

		const tasks = JSON.parse(data);

		const filteredTasks = tasks.filter(task => task.id != id)

		fs.writeFile('./database/tasks.json', JSON.stringify(filteredTasks), (err) => {
			if (err) throw err

			renderTasks(res, filteredTasks)
		})
	})
})

app.get("/tasks/:id/archive", (req, res) => {
	fs.readFile('./database/tasks.json', (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.archive = true
	  tasks.push(splicedTask)
  
	  fs.writeFile('./database/tasks.json', JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
  })

  app.get("/tasks/:id/proceed", (req, res) => {
	fs.readFile('./database/tasks.json', (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.status += 1
	  tasks.push(splicedTask)
  
	  fs.writeFile('./database/tasks.json', JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
  })

  app.get("/tasks/:id/back", (req, res) => {
	fs.readFile('./database/tasks.json', (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.status -= 1
	  tasks.push(splicedTask)
  
	  fs.writeFile('./database/tasks.json', JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
  })

app.listen('8000', (error) => {
    if (error) throw error;

    console.log("Application running on port 8000");
});

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

function renderTasks(res, tasks) {

		const notArchivedTasks = tasks.filter(task => task.archive != true)

		const toDoTasks = notArchivedTasks.filter(task => task.status == status.toDo)
		const doingTasks = notArchivedTasks.filter(task => task.status == status.doing)
		const doneTasks = notArchivedTasks.filter(task => task.status == status.done)

		res.render('tasks', { tsToDo: toDoTasks, tsDoing: doingTasks, tsDone: doneTasks })
}