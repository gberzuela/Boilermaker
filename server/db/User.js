const Sequelize = require('sequelize');
const db = require('./database');

const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	imageUrl: Sequelize.STRING,
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	salt: Sequelize.STRING,
	password: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	googleId: Sequelize.STRING,
});

module.exports = User;
