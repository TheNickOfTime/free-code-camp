'use strict';

const Translator = require('../components/translator.js');
require('body-parser');

module.exports = function (app) {
	const translator = new Translator();

	app.route('/api/translate').post((req, res) => {
		const text = req.body.text;
		const locale = req.body.locale;

		if (text !== undefined && locale !== undefined) {
			// console.log(locale);

			if (text === '') {
				res.json({ error: 'No text to translate' });
				return;
			}

			if (locale !== 'american-to-british' && locale !== 'british-to-american') {
				res.json({ error: 'Invalid value for locale field' });
				return;
			}

			const result = translator.translate(text, locale);
			res.json({ text: text, translation: result });
		} else {
			res.json({ error: 'Required field(s) missing' });
		}
	});
};
