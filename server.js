var express = require('express');
var app = express();
var _ = require('underscore'); //underscorejs.org
var db = require('./db.js');
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var bcrypt = require('bcrypt-nodejs');

var todos = [];
//process.env.PORT is env variable provided by heroku and 
//is used by heroku when deployed
var todoNextId = 1;
app.get('/', function(req, res) {
	res.send('Todo API');

});



/********************************************
we have data and now we are going for some request
url can be GET /todos
			GET/todos/:id
			**************************/

//GET/todos?completed=true
app.get('/todos', function(req, res) {
	var query = req.query;

	var where = {};
	if (query.hasOwnProperty('completed') && query.completed === "true") {
		where.completed = true;

	} else if (query.hasOwnProperty('completed') && query.completed === "false") {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
			where: where
		}).then(function(todos) {
			res.json(todos);
		}, function(e) {
			res.status(500).send();
		})
		// var filteredTodos = todos;
		// // var filterQ = todos;

	// //add description query later
	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
})

// GET/todos/:id

app.get('/todos/:id', function(req, res) {
		var todoid = parseInt(req.params.id, 10); // since req param is a string
		db.todo.findById(todoid).then(function(todo) {
			if (!!todo) {
				//!! truthy version of the object
				res.status(200).send(todo.toJSON())
			} else
				res.status(404).send();

		}, function(error) {
			res.status(500).send(error.toJSON());

		})


	})
	// POST request to take data
	// the url wil be same as get url

app.post('/todos', function(req, res) {
	//var body=req.body;
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		res.status(200).send(todo.toJSON());
	}, function(e) {
		console.log('error occured.');
		res.status(400).json(e);
	});

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	res.status(404).send();
	// }
	// body.description = body.description.trim();
	// body.id = todoNextId;
	// todoNextId++;
	// todos.push(body);


	// console.log('des : ' + body.description);
	// res.json(body);

});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
		// var todoid_delete = parseInt(req.params.id, 10);
		// var matchedTodo = _.findWhere(todos, {
		// 	id: todoid_delete
		// });

		// if (!matchedTodo) {
		// 	res.status(404).json({
		// 		"error": "no matched toDo"
		// 	});
		// } else {
		// 	todos = _.without(todos, matchedTodo);
		// 	res.json(matchedTodo);
		// }
		/******************* WITH sequilize ************************/

		var todoid = parseInt(req.params.id, 10);
		db.todo.destroy({
			where: {
				id: todoid
			}
		}).then(function(rowsDeleted) {
				if (rowsDeleted === 0) {
					res.status(404).json({
						error: 'No such item found. Check the id given'
					});
				} else {
					res.status(200).send("An item is found and is deleted \n");
				}
			},
			function(error) {
				res.status(500).send(error);
			}
		);

	})
	//PUT method.. to update a to do it
	// url is specific to each item so it has the id in the url
	//validate the object you are going to receive, before updation
app.put('/todos/:id', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};
	var todoid = parseInt(req.params.id, 10);


	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	//Here we will have to use an instance method, instea of a model method

	db.todo.findById(todoid).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				//everything above is a follow up to findById
				//this is a follow up to todo update
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).send(e);
			});
		} else {
			res.status(404).send();
		}
	}, function(error) {
		res.status(500).json({
			error: 'Find by Id failed'
		});
	})
});
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	db.user.create(body).then(function(todo) {
		if (todo) {
			res.json(todo.toPublicJSON());
		} else {
			return res.status(400).json({
				"error": "some error with creating account"
			});
		}

	}, function(e) {
		res.status(400).json(e);
	});
});


app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	//authenticate is user built method;
	db.user.authenticate(body).then(function(user) {
		 res.json(user.toPublicJSON());
		// res.json("success");
	}, function() {
		return res.status(401).send();
	});

})
db.sequelize.sync({force:true}).then(function() {
	app.listen(PORT, function() {
		console.log('express listening on PORT: ' + PORT);
	});
})