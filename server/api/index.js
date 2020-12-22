const router = require('express').Router();

// mounted on /api
// router.use('/', require())

// 404 handling; cannot find specific route
router.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	next(err);
});

module.exports = router;
