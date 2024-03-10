const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const { MongoClient } = require('mongodb');
const server = require('../server');

chai.use(chaiHttp);

// Mongo -----------------------------------------------------------------------
const database = new MongoClient(process.env.MONGO_URI);
const dbConnect = async () => {
	try {
		console.log('Connecting to database...');
		await database.connect();
		console.log('Database connected');
	} catch (error) {
		console.error(error);
		throw new Error('Unable to Connect to Database');
	}
};
dbConnect().then(() => {database.db('stock-price-checker').collection('stocks').drop()})

suite('Functional Tests', function() {
	test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
			.get('/api/stock-prices?stock=GOOG')
			.end(function (err, res) {
				// console.log(res.body)
				assert.equal(res.status, 200, 'Response status does not equal 200');
				assert.isObject(res.body, 'Response is not an object type');
				assert.property(res.body, 'stockData');
				assert.isObject(res.body.stockData);
				assert.property(res.body.stockData, 'stock');
				assert.isString(res.body.stockData.stock)
				assert.property(res.body.stockData, 'price');
				assert.isNumber(res.body.stockData.price)
				assert.property(res.body.stockData, 'likes');
				assert.isNumber(res.body.stockData.likes);
				done()
			})
	})

	test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
			.get('/api/stock-prices?stock=AAPL')
			.then(data => {
				likes = data.body.stockData.likes
				chai.request(server)
					.get('/api/stock-prices?stock=AAPL&like=true')
					.end((err, res) => {
						assert.equal(res.status, 200, 'Response status does not equal 200');
						assert.isObject(res.body, 'Response is not an object type');
						assert.property(res.body, 'stockData');
						assert.isObject(res.body.stockData);
						assert.property(res.body.stockData, 'stock');
						assert.isString(res.body.stockData.stock)
						assert.property(res.body.stockData, 'price');
						assert.isNumber(res.body.stockData.price)
						assert.property(res.body.stockData, 'likes');
						assert.isNumber(res.body.stockData.likes);
						assert.equal(res.body.stockData.likes, likes + 1)
						done();
					})
			})
	})

	test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
			.get('/api/stock-prices?stock=AAPL')
			.then(data => {
				likes = data.body.stockData.likes
				chai.request(server)
					.get('/api/stock-prices?stock=AAPL&like=true')
					.end((err, res) => {
						assert.equal(res.status, 200, 'Response status does not equal 200');
						assert.isObject(res.body, 'Response is not an object type');
						assert.property(res.body, 'stockData');
						assert.isObject(res.body.stockData);
						assert.property(res.body.stockData, 'stock');
						assert.isString(res.body.stockData.stock)
						assert.property(res.body.stockData, 'price');
						assert.isNumber(res.body.stockData.price)
						assert.property(res.body.stockData, 'likes');
						assert.isNumber(res.body.stockData.likes);
						assert.equal(res.body.stockData.likes, likes)
						done();
					})
			})
	})

	test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
			.get('/api/stock-prices?stock=GOOG&stock=MSFT')
			.end(function (err, res) {
				// console.log(res.body)
				assert.equal(res.status, 200, 'Response status does not equal 200');
				assert.isObject(res.body, 'Response is not an object type');
				assert.property(res.body, 'stockData');
				assert.isArray(res.body.stockData);
				assert.property(res.body.stockData[0], 'stock');
				assert.isString(res.body.stockData[0].stock)
				assert.propertyVal(res.body.stockData[0], 'stock', 'GOOG')
				assert.property(res.body.stockData[0], 'price');
				assert.isNumber(res.body.stockData[0].price)
				assert.property(res.body.stockData[0], 'rel_likes');
				assert.isNumber(res.body.stockData[0].rel_likes);
				assert.property(res.body.stockData[1], 'stock');
				assert.isString(res.body.stockData[1].stock)
				assert.propertyVal(res.body.stockData[1], 'stock', 'MSFT')
				assert.property(res.body.stockData[1], 'price');
				assert.isNumber(res.body.stockData[1].price)
				assert.property(res.body.stockData[1], 'rel_likes');
				assert.isNumber(res.body.stockData[1].rel_likes);
				done()
			})
	})

	test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
			.get('/api/stock-prices?stock=GOOG&stock=AAPL')
			.then(data => {
				likes = data.body.stockData.likes
				chai.request(server)
					.get('/api/stock-prices?stock=GOOG&stock=AAPL&like=true')
					.end((err, res) => {
						assert.equal(res.status, 200, 'Response status does not equal 200');
						assert.isObject(res.body, 'Response is not an object type');
						assert.property(res.body, 'stockData');
						assert.isArray(res.body.stockData);
						assert.property(res.body.stockData[0], 'stock');
						assert.isString(res.body.stockData[0].stock)
						assert.propertyVal(res.body.stockData[0], 'stock', 'GOOG')
						assert.property(res.body.stockData[0], 'price');
						assert.isNumber(res.body.stockData[0].price)
						assert.property(res.body.stockData[0], 'rel_likes');
						assert.propertyVal(res.body.stockData[0], 'rel_likes', 0)
						assert.isNumber(res.body.stockData[0].rel_likes);
						assert.property(res.body.stockData[1], 'stock');
						assert.isString(res.body.stockData[1].stock)
						assert.propertyVal(res.body.stockData[1], 'stock', 'AAPL')
						assert.property(res.body.stockData[1], 'price');
						assert.isNumber(res.body.stockData[1].price)
						assert.property(res.body.stockData[1], 'rel_likes');
						assert.propertyVal(res.body.stockData[0], 'rel_likes', 0)
						assert.isNumber(res.body.stockData[1].rel_likes);
						done()
					})
			})
	})
});
