const Sequelize = require('sequelize');
const pg = require('../../package.json');

const dbName = pg.name;
const db = new Sequelize(
	process.send.DATABASE_URL || `postgres://localhost:5432/${dbName}`,
	{
		logging: false,
	}
);

module.exports = db;
