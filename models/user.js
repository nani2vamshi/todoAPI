module.exports = function(sequelize, DataTypes) {
	//define has two parameters, 1) name 2)array of attributes for model
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			//makes sure there are no records with same value
			validate: {
				isEmail : true
			}
		},
		password :{
			type : DataTypes.STRING,
			allowNull :false,
			validate :{
				len : [7,100],
			}
		}
	})
}