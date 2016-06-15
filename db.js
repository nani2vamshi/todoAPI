// server .js requests database from db.js
//db.js returns it from the database.sqlite

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development'; // for postgres-heroku
var sequelize;
if (env === 'production') {
	//when on heroku
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		'dialect': 'postgres'
	});

} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}
// var sequelize = new Sequelize(undefined, undefined, undefined, {
// 	'dialect' : 'sqlite',
// 	'storage': __dirname + '/data/dev-todo-api.sqlite'
// });

var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.SEQUELIZE = Sequelize;

module.exports = db;