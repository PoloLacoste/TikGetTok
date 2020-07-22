'use strict';

const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const express = require('express')
const app = express()

require('dotenv').config()

const validate = require('./validator');
const { param } = require('express-validator');

const TikTokScraper = require('tiktok-scraper');

const sequelize = require('./db.js');
const Sequelize = require('sequelize');

sequelize.sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
		process.exit(1);
	}
);

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
	  return val;
	}
	if (port >= 0) {
	  return port;
	}
	return false;
}

const port = normalizePort(process.env.PORT || '3000');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	TikTokScraper.user(req.params.username).then((posts) => {
		res.json(posts['collector']);
	}).catch(() => {
		res.status(500).json({
			'error': 'Server error'
		});
	});
});

app.get('/filter/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	TikTokScraper.user(req.params.username).then((posts) => {
		res.json(filterPosts(posts['collector'], req.params.username));
	}).catch(() => {
		res.status(500).json({
			'error': 'Server error'
		});
	});
});

app.get('/update/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	TikTokScraper.user(req.params.username).then(async (posts) => {
		
		let data = filterPosts(posts['collector'], req.params.username);
		await sequelize.stat.bulkCreate(data);

		res.json({});
	}).catch((e) => {
		console.log(e);
		res.status(500).json({
			'error': 'Server error'
		});
	});
});

app.get('/stats/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	let stats = await sequelize.stat.findAll({
		where: {
			username: req.params.username
		},
	});

	let data = new Map();

	stats.forEach((stat) => {
		let date = stat.date;
		if(date in data) {
			data[date].push(stat);
		}
		else {
			data[date] = [stat];
		}
	});

	console.log(data);

	res.json(data);
});

app.get('*', async (req, res) => {
	res.status(404).json({});
});

function filterPosts(posts, username)
{
	let data = [];
	
	let date = new Date();

	posts.forEach(post => {
		data.push({
			'id': post.id,
			'likes': post.diggCount,
			'play': post.playCount,
			'username': username,
			'date': date
		});
	});

	return data;
}

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

