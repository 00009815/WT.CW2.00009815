const fs = require('fs')
const path = require('path')

const express = require("express")
const router = express.Router()

const root = path.dirname(
    require.main.filename || process.require.main.filename
  );

  const status = {
	toDo: 0,
	doing: 1,
	done: 2
}

router.get('/create', (req, res) => {
    res.render('create-task');
});

router.post('/create', (req, res) => {
	const title = req.body.title
	const description = req.body.description

	

	if(title.trim() == '' && description.trim() == '') {
		res.render('create-task', {error: true})
	} else{
		fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
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

router.get('/', (req, res) => {

	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
		if(err) throw err

		const tasks = JSON.parse(data)
		

		renderTasks(res, tasks)
	})
	

})

router.get('/archive', (req, res) => {

	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
		if(err) throw err

		const tasks = JSON.parse(data)
		
		renderArchive(res, tasks)
		
	})
	

})

router.get('/:id/delete', (req, res) => {
	const id = req.params.id;

	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
		if (err) throw err

		const tasks = JSON.parse(data);

		const filteredTasks = tasks.filter(task => task.id != id)

		fs.writeFile(path.join(root,'database/tasks.json'), JSON.stringify(filteredTasks), (err) => {
			if (err) throw err

			renderTasks(res, filteredTasks)
		})
	})
})

router.get("/:id/archive", (req, res) => {
	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.archive = true
	  tasks.push(splicedTask)
  
	  fs.writeFile(path.join(root,'database/tasks.json'), JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
})

router.get("/:id/unarchive", (req, res) => {
	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.archive = false
	  tasks.push(splicedTask)
  
	  fs.writeFile(path.join(root,'database/tasks.json'), JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderArchive(res, tasks)
	  })
	  
	})
})

router.get("/:id/proceed", (req, res) => {
	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.status += 1
	  tasks.push(splicedTask)
  
	  fs.writeFile(path.join(root,'database/tasks.json'), JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
})

router.get("/:id/back", (req, res) => {
	fs.readFile(path.join(root,'database/tasks.json'), (err, data) => {
	  if (err) throw err
  
	  const tasks = JSON.parse(data)
	  const task = tasks.filter(task => task.id == req.params.id)[0]
	  const taskIdx = tasks.indexOf(task)
	  const splicedTask = tasks.splice(taskIdx, 1)[0]
	  splicedTask.status -= 1
	  tasks.push(splicedTask)
  
	  fs.writeFile(path.join(root,'database/tasks.json'), JSON.stringify(tasks), err => {
		if (err) throw err
  
		renderTasks(res, tasks)
	  })
	  
	})
})

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
function renderArchive(res, tasks){
	const archivedTasks = tasks.filter(task => task.archive == true)

		const stages = {
			0: "To do",
			1: "Doing",
			2: "Done"
		}
		res.render('archive', {archive: archivedTasks, stages: stages})
}

module.exports = router;