var express = require('express');
var app = express();
var _ = require('underscore'); //underscorejs.org
var db = require('./db.js');
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var todos = [];
//process.env.PORT is env variable provided by heroku and 
//is used by heroku when deployed
var todoNextId = 1;
app.get('/', function(req, res) {
	res.send('Todo API Root');

});



/********************************************
we have data and now we are going for some request
url can be GET /todos
			GET/todos/:id
			**************************/

//GET/todos?completed=true
app.get('/todos', function(req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;
	// var filterQ = todos;

	//add description query later
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
})

// GET/todos/:id

app.get('/todos/:id', function(req, res) {
		var todoid = parseInt(req.params.id, 10); // since req param is a string
		// var matcheditem;
		// todos.forEach(function(todo){
		// 	if(todoid === todo.id){
		// 		matcheditem = todo;
		// 	}
		// });
		var matcheditem = _.findWhere(todos, {
			id: todoid
		});

		if (matcheditem) {
			res.json(matcheditem);
		} else {
			res.status(404).send();
		}
		res.send('Asking for todo with id of ' + req.params.id);


	})
	// POST request to take data
	// the url wil be same as get url

app.post('/todos', function(req, res) {
	//var body=req.body;
	var body = _.pick(req.body, 'description', 'completed');
	db.todo.create(body).then(function(todo) {
		res.status(200).send(todo.toJSON());
	},function(e) {
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
		var todoid_delete = parseInt(req.params.id, 10);
		var matchedTodo = _.findWhere(todos, {
			id: todoid_delete
		});

		if (!matchedTodo) {
			res.status(404).json({
				"error": "no matched toDo"
			});
		} else {
			todos = _.without(todos, matchedTodo);
			res.json(matchedTodo);
		}

	})
	//PUT method.. to update a to do it
	// url is specific to each item so it has the id in the url
	//validate the object you are going to receive, before updation
app.put('/todos/:id', function(req, res) {

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	var todoid = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoid
	});

	if (!matchedTodo) {
		return res.status(404).json({
			"error": "no matched toDo"
		});
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		//if it has the property and it is a boolean,we need to validate it
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		//the property exists but it is not a boolean
		res.status(400).send('error : not booelan');
	}
	console.log("matched to do found");
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length === 0) {
		//if it has the property and it is a boolean,we need to validate it
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		//the property exists but it is not a string or it is empty
		res.status(400).send('not string or an empty string');
	}

	//use _.extend method
	//Copy all of the properties in the source objects over to
	//the destination object, and return the destination object.
	//It's in-order, so the last source will override properties 
	//of the same name in previous arguments.

	// _.extend({name: 'moe'}, {age: 50});
	// => {name: 'moe', age: 50}

	_.extend(matchedTodo, validAttributes);
	console.log("exited descr");
	res.json(matchedTodo); //autoamtically sends 200

});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('express listening on PORT: ' + PORT);
	});
})