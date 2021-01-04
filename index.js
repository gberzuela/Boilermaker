const { db } = require('./server/db');
const app = require('./server');
const PORT = process.env.PORT || 3000;
/*
   !!!! Remove force: true for production !!!!
*/
db.sync({ force: true }).then(() => {
	app.listen(PORT, () => {
		console.log(`Listening in on port: ${PORT}\nhttp://localhost:3000/
		`);
	});
});
