const status = {
	toDo: 0,
	doing: 1,
	done: 2
}
const stages = {
    0: "To do",
    1: "Doing",
    2: "Done"
}

module.exports.id = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };


module.exports.renderTasks = function (res, tasks) {

	const notArchivedTasks = tasks.filter(task => task.archive != true)

	const toDoTasks = notArchivedTasks.filter(task => task.status == status.toDo)
	const doingTasks = notArchivedTasks.filter(task => task.status == status.doing)
	const doneTasks = notArchivedTasks.filter(task => task.status == status.done)

	res.render('tasks', { tsToDo: toDoTasks, tsDoing: doingTasks, tsDone: doneTasks })
}


module.exports.renderArchive = function (res, tasks){
	const archivedTasks = tasks.filter(task => task.archive == true)

		
		res.render('archive', {archive: archivedTasks, stages: stages})
}