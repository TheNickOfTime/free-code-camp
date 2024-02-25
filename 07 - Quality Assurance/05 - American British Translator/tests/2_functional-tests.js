const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');
require('body-parser');

suite('Functional Tests', () => {
	test('Translation with text and locale fields: POST request to /api/translate', (done) => {
		const originalText = 'Mangoes are my favorite fruit';
		const locale = 'american-to-british';
		const translationText = 'Mangoes are my <span class="highlight">favourite</span> fruit';
		chai.request(server)
			.post('/api/translate')
			.send({ text: originalText, locale: locale })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'text');
				assert.propertyVal(res.body, 'text', originalText);
				assert.property(res.body, 'translation');
				assert.propertyVal(res.body, 'translation', translationText);
				done();
			});
	});
	test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
		const originalText = 'Mangoes are my favorite fruit';
		const locale = 'american-to-french';
		chai.request(server)
			.post('/api/translate')
			.send({ text: originalText, locale: locale })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Invalid value for locale field');
				done();
			});
	});
	test('Translation with missing text field: POST request to /api/translate', (done) => {
		const originalText = 'Mangoes are my favorite fruit';
		const locale = 'american-to-british';
		chai.request(server)
			.post('/api/translate')
			.send({ locale: locale })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Required field(s) missing');
				done();
			});
	});
	test('Translation with missing locale field: POST request to /api/translate', (done) => {
		const originalText = 'Mangoes are my favorite fruit';
		const locale = 'american-to-british';
		chai.request(server)
			.post('/api/translate')
			.send({ text: originalText })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Required field(s) missing');
				done();
			});
	});
	test('Translation with empty text: POST request to /api/translate', (done) => {
		const originalText = '';
		const locale = 'american-to-british';
		chai.request(server)
			.post('/api/translate')
			.send({ text: originalText, locale: locale })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'No text to translate');
				done();
			});
	});
	test('Translation with text that needs no translation: POST request to /api/translate', (done) => {
		const originalText = 'No words to translate';
		const locale = 'american-to-british';
		const translationText = 'Everything looks good to me!';
		chai.request(server)
			.post('/api/translate')
			.send({ text: originalText, locale: locale })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'text');
				assert.propertyVal(res.body, 'text', originalText);
				assert.property(res.body, 'translation');
				assert.propertyVal(res.body, 'translation', translationText);
				done();
			});
	});
});
