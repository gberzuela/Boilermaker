const router = require('express').Router();
const { User } = require('../db');
const bcrypt = require('bcrypt');

// Mounted on /auth
router.use('/google', require('./google'));

router.get('/me', (req, res) => {
	res.send(req.user);
});

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) res.status(401).send('Incorrect email or password');
		else if (await bcrypt.compare(password, user.password)) {
			const { id, name, email } = user;
			res.status(200).send({ id, name, email });
		} else {
			res.status(401).send('Incorrect email or password');
		}
	} catch (error) {
		next(error);
	}
});

router.post('/signup', async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);
			await User.create({ name, email, salt, password: hashedPassword });
			res.sendStatus(204);
		} else {
			res.status(401).send(`There is already an account for ${email}`);
		}
	} catch (error) {
		next(error);
	}
});

router.post('/logout', (req, res) => {
	req.logout();
	req.session.destroy();
	res.redirect('/login');
});

module.exports = router;
