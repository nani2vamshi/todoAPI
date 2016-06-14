var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	//tell it to use sqlite db
	//where it is saved
	'dialect': 'sqlite',
	'storage': __dirname + '/basic_sqlite_db.sqlite'
		//double underscore
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			// notEmpty : true or
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false

	}
})

sequelize.sync({
	//force: true
}).then(function() {
	console.log('Everything is synced');
	Todo.findById(3).then(function(todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('Todo item not found');
		}
	});
	// Todo.create({
	// 	description: 'take out trash',
	// 	completed: false
	// }).then(function(todo) {
	// 	return Todo.create({
	// 		description: 'clean the room'
	// 	});
	// }).then(function() {
	// 	//return Todo.findById(1)
	// 	return Todo.findAll({
	// 		where :{
	// 			//completed :false,
	// 			description : {
	// 				$like : '%trash%'
	// 			}
	// 		}
	// 	});
	// }).then(function(todos) {
	// 	if (todos) {
	// 		todos.forEach(function(todo){
	// 			console.log(todo.toJSON());
	// 		})

	// 	} else {
	// 		console.log('no todo found');
	// 	}
	// }).catch(function(e) {
	// 	console.log(e);
	// });
})