'use strict';

const { createHash } = require('crypto');
const { type } = require('os');
const { nextTick } = require('process');

module.exports = async (app, db) => {
	app.route('/api/stock-prices').get(async (req, res) => {
		const stocks = typeof(req.query.stock) === 'string' ? [req.query.stock] : req.query.stock;
		const like = req.query.like === 'true' ? true : false
		
		if (like) {
			for await (const stock of stocks) {
				const ip = createHash('sha256').update(req.ip).digest('base64');
				const stockData = await db.findOne({stock: stock});
				const alreadyLiked = stockData && stockData['likes'] && stockData['likes'].includes(ip);
				// console.log(alreadyLiked);

				if (!alreadyLiked) {
					const result = await db.updateOne(
						{stock: stock},
						{$push: {likes: ip}},
						{upsert: true}
					);
				}
			}
		}

		const stocksData = await getStockData(stocks, db);
		// console.log(stocksData)
		res.json({stockData: stocksData});
	});
};

async function getStockData(stocks, db) {
	const isMultiStock = stocks.length > 1;
	let stocksData = [];
	let likesData = []

	for await (const stock of stocks) {
		// Get stock data from API
		const requestURL = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;
		const request = await fetch(requestURL);
		const stockData = await request.json();
		stocksData[stock] = stockData

		// Get likes data from mongo
		const mongoResult = await db.findOne({stock: stock})
		const likeCount = mongoResult ? mongoResult.likes.length : 0
		likesData[stock] = likeCount
	}

	if (isMultiStock) {
		const likesValues = Object.values(likesData)
		// console.log(likesData)
		stocks.map((stock, index) => {
			const nextIndex = index + 1 === stocks.length ? 0 : index + 1;
			likesData[stock] = likesValues[index] - likesValues[nextIndex];
		})
		// console.log(likesData)
	}

	const result = stocks.map((stock, index) => {
		const symbol = stocksData[stock].symbol;
		const price = stocksData[stock].latestPrice;
		const likes = likesData[stock];

		// console.log(typeof(symbol), typeof(price), typeof(likes))

		return {
			stock: symbol,
			price: price,
			[isMultiStock ? 'rel_likes' : 'likes']: likes
		}
	})
	

	return isMultiStock ? result : result[0]
}
