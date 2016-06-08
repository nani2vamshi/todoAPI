var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//process.env.PORT is env variable provided by heroku and 
//is used by heroku when deployed
var todos =[{
	id: 1,
	description : "meet mom for lunch",
	completed 	: false

},{
	id:2,
	description:"go to market",
	completed : false
},
{
	id:3,
	description:"go to bed",
	completed : true
}];
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
	var matcheditem;
	todos.forEach(function(todo){
		if(todoid === todo.id){
			matcheditem = todo;
		}
	});

	if(matcheditem)
	{
		res.json(matcheditem);
	}
	else{res.status(404).send();}
	res.send('Asking for todo with id of '+req.params.id);
})

app.listen(PORT, function(){
	console.log('express listening on PORT: '+ PORT);
});