const Sequelize = require('sequelize');
const db = require('./database');

const Model = db.define('model');

module.exports = Model;
