var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;
//process.env.PORT is env variable provided by heroku and 
//is used by heroku when deployed

app.get('/',function(req,res){
	res.send('Todo API Root');

});

app.listen(PORT, function(){
	console.log('express listening on PORT: '+ PORT);
});