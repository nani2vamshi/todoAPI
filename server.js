var express = require('express');
var app = express();
var _ = require('underscore');//underscorejs.org
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var todos = [];
//process.env.PORT is env variable provided by heroku and 
//is used by heroku when deployed
var todoNextId =1;
app.get('/',function(req,res){
	res.send('Todo API Root');

});



/********************************************
we have data and now we are going for some request
url can be GET /todos
			GET/todos/:id
			**************************/
app.get('/todos', function(req, res){
	res.json(todos);
})

// GET/todos/:id

app.get('/todos/:id', function(req,res){
	var todoid = parseInt(req.params.id,10);// since req param is a string
	// var matcheditem;
	// todos.forEach(function(todo){
	// 	if(todoid === todo.id){
	// 		matcheditem = todo;
	// 	}
	// });
	var matcheditem = _.findWhere(todos,{id : todoid});

	if(matcheditem)
	{
		res.json(matcheditem);
	}
	else{res.status(404).send();}
	res.send('Asking for todo with id of '+req.params.id);


})
// POST request to take data
// the url wil be same as get url

app.post('/todos', function(req,res){
	//var body=req.body;
	var body = _.pick(req.body,'description','completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0)
	{
		res.status(404).send();
	}
	body.description = body.description.trim();
	body.id= todoNextId;
	todoNextId++;
	todos.push(body);


	console.log('des : '+body.description);
	res.json(body);

});

app.listen(PORT, function(){
	console.log('express listening on PORT: '+ PORT);
});