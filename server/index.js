const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

// logging middleware
app.use(morgan('dev'));

// static middleware
app.use(express.static(path.join(__dirname, '../public')));

// parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', require('./api'));

// send index HTML
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 500 handling; internal server error
app.use((err, req, res) => {
	res.status(err.status || 500);
	res.send(err.message || 'Internal server error');
});

module.exports = app;
