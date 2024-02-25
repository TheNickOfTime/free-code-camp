const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
	test('Translate Mangoes are my favorite fruit. to British English', () => {
		const translation = translator
			.translate('Mangoes are my favorite fruit.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Mangoes are my favourite fruit.';
		assert.equal(translation, expected);
	});
	test('Translate I ate yogurt for breakfast. to British English', () => {
		const translation = translator
			.translate('I ate yogurt for breakfast.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'I ate yoghurt for brekky.';
		assert.equal(translation, expected);
	});
	test("Translate We had a party at my friend's condo. to British English", () => {
		const translation = translator
			.translate("We had a party at my friend's condo.", 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = "We had a party at my friend's flat.";
		assert.equal(translation, expected);
	});
	test('Translate Can you toss this in the trashcan for me? to British English', () => {
		const translation = translator
			.translate('Can you toss this in the trashcan for me?', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Can you toss this in the bin for me?';
		assert.equal(translation, expected);
	});
	test('Translate The parking lot was full. to British English', () => {
		const translation = translator
			.translate('The parking lot was full.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'The car park was full.';
		assert.equal(translation, expected);
	});
	test('Translate Like a high tech Rube Goldberg machine. to British English', () => {
		const translation = translator
			.translate('Like a high tech Rube Goldberg machine.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Like a high tech Heath Robinson device.';
		assert.equal(translation, expected);
	});
	test('Translate To play hooky means to skip class or work. to British English', () => {
		const translation = translator
			.translate('To play hooky means to skip class or work.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'To bunk off means to skip class or work.';
		assert.equal(translation, expected);
	});
	test('Translate No Mr. Bond, I expect you to die. to British English', () => {
		const translation = translator
			.translate('No Mr. Bond, I expect you to die.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'No Mr Bond, I expect you to die.';
		assert.equal(translation, expected);
	});
	test('Translate Dr. Grosh will see you now. to British English', () => {
		const translation = translator
			.translate('Dr. Grosh will see you now.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Dr Grosh will see you now.';
		assert.equal(translation, expected);
	});
	test('Translate Lunch is at 12:15 today. to British English', () => {
		const translation = translator
			.translate('Lunch is at 12:15 today.', 'american-to-british')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Lunch is at 12.15 today.';
		assert.equal(translation, expected);
	});
	test('Translate We watched the footie match for a while. to American English', () => {
		const translation = translator
			.translate('We watched the footie match for a while.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'We watched the soccer match for a while.';
		assert.equal(translation, expected);
	});
	test('Translate Paracetamol takes up to an hour to work. to American English', () => {
		const translation = translator
			.translate('Paracetamol takes up to an hour to work.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Tylenol takes up to an hour to work.';
		assert.equal(translation, expected);
	});
	test('Translate First, caramelise the onions. to American English', () => {
		const translation = translator
			.translate('First, caramelise the onions.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'First, caramelize the onions.';
		assert.equal(translation, expected);
	});
	test('Translate I spent the bank holiday at the funfair. to American English', () => {
		const translation = translator
			.translate('I spent the bank holiday at the funfair.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'I spent the public holiday at the carnival.';
		assert.equal(translation, expected);
	});
	test('Translate I had a bicky then went to the chippy. to American English', () => {
		const translation = translator
			.translate('I had a bicky then went to the chippy.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'I had a cookie then went to the fish-and-chip shop.';
		assert.equal(translation, expected);
	});
	test("Translate I've just got bits and bobs in my bum bag. to American English", () => {
		const translation = translator
			.translate("I've just got bits and bobs in my bum bag.", 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = "I've just got odds and ends in my fanny pack.";
		assert.equal(translation, expected);
	});
	test('Translate The car boot sale at Boxted Airfield was called off. to American English', () => {
		const translation = translator
			.translate('The car boot sale at Boxted Airfield was called off.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'The swap meet at Boxted Airfield was called off.';
		assert.equal(translation, expected);
	});
	test('Translate Have you met Mrs Kalyani? to American English', () => {
		const translation = translator
			.translate('Have you met Mrs Kalyani?', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Have you met Mrs. Kalyani?';
		assert.equal(translation, expected);
	});
	test("Translate Prof Joyner of King's College, London. to American English", () => {
		const translation = translator
			.translate("Prof Joyner of King's College, London.", 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = "Prof. Joyner of King's College, London.";
		assert.equal(translation, expected);
	});
	test('Translate Tea time is usually around 4 or 4.30. to American English', () => {
		const translation = translator
			.translate('Tea time is usually around 4 or 4.30.', 'british-to-english')
			.replace(/(<([^>]+)>)/g, '');
		const expected = 'Tea time is usually around 4 or 4:30.';
		assert.equal(translation, expected);
	});
	test('Highlight translation in Mangoes are my favorite fruit.', () => {
		const translation = translator.translate(
			'Mangoes are my favorite fruit.',
			'american-to-british'
		);
		const expected = 'Mangoes are my <span class="highlight">favourite</span> fruit.';
		assert.equal(translation, expected);
	});
	test('Highlight translation in I ate yogurt for breakfast.', () => {
		const translation = translator.translate(
			'I ate yogurt for breakfast.',
			'american-to-british'
		);
		const expected =
			'I ate <span class="highlight">yoghurt</span> for <span class="highlight">brekky.</span>';
		assert.equal(translation, expected);
	});
	test('Highlight translation in We watched the footie match for a while.', () => {
		const translation = translator.translate(
			'We watched the footie match for a while.',
			'british-to-english'
		);
		const expected = 'We watched the <span class="highlight">soccer</span> match for a while.';
		assert.equal(translation, expected);
	});
	test('Highlight translation in Paracetamol takes up to an hour to work.', () => {
		const translation = translator.translate(
			'Paracetamol takes up to an hour to work.',
			'british-to-english'
		);
		const expected = '<span class="highlight">Tylenol</span> takes up to an hour to work.';
		assert.equal(translation, expected);
	});
});
