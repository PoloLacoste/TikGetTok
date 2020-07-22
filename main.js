const express = require('express')
const app = express()

const validate = require('./validator');
const { param } = require('express-validator');

const TikTokScraper = require('tiktok-scraper');

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
		res.json(filterPosts(posts['collector']));
	}).catch(() => {
		res.status(500).json({
			'error': 'Server error'
		});
	});
});

app.get('*', async (req, res) => {
	res.status(404).json({});
});

function filterPosts(posts)
{
	let data = [];

	posts.forEach(post => {
		data.push({
			'id': post.id,
			'likes': post.diggCount,
			'play': post.playCount,
		});
	});

	return data;
}

app.listen(port, () => {
	console.log(`Listening on port: ${port}`);
});

