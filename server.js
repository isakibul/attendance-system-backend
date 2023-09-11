const express = require('express');
const connectDB = require('./db');
const authenticate = require('./middleware/authenticate');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use(routes);

app.get('/private', authenticate, async (req, res) => {
	console.log('I am authenticated', req.user);
	return res.status(200).json({ message: 'I am a private route' });
});

app.get('/public', (req, res) => {
	return res.status(200).json({ message: 'I am a public route' });
});

app.get('/', (_req, res) => {
	const obj = {
		name: 'Sakibul',
		email: 'sakibul@example.com',
	};
	res.json(obj);
});

app.use((err, _req, res, _next) => {
	console.log(err);
	const message = err.message ? err.message : 'Server Error Occurred';
	const status = err.status ? err.status : 500;

	res.status(status).json({
		message,
	});
});

connectDB('mongodb://127.0.0.1:27017/attendance-db')
	.then(() => {
		console.log('Database Connected');
		app.listen(8000, () => {
			console.log("I'm listening on port 8000");
		});
	})
	.catch((e) => console.log(e));