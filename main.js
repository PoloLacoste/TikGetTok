const express = require('express')
const app = express()

const validate = require('./validator');
const { param } = require('express-validator');

const TikTokScraper = require('tiktok-scraper');

const port = 3000;

app.get('/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	TikTokScraper.user(req.params.username).then((posts) => {
		res.json(posts['collector']);
	}).catch(() => {
		
	});
});

app.get('/filter/:username', [
	param('username', 'Username is required').not().isEmpty()
], validate, async (req, res) => {
	TikTokScraper.user(req.params.username).then((posts) => {
		res.json(filterPosts(posts['collector']));
	}).catch(() => {
		
	});
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

