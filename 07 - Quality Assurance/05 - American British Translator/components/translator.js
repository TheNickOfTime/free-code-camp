const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

const britishToAmerican = (input) => {
	return Object.keys(input).reduce((prev, current) => {
		return { ...prev, [`${input[current]}`]: current };
	}, {});
};

const translateTerms = (text, toBritish) => {
	let translatedText = text;
	const termsMap = toBritish
		? { ...americanOnly, ...britishToAmerican(britishOnly) }
		: { ...britishToAmerican(americanOnly), ...britishOnly };
	Object.keys(termsMap).forEach((key) => {
		const termRegex = new RegExp(`(\\s\|\^)(${key})(\\s\|[.?!]\$)`, 'gi');
		// console.log(termRegex);
		translatedText = translatedText.replaceAll(
			termRegex,
			`$1*${termsMap[key].replaceAll(/\s/g, '_')}$3`
		);
	});
	// console.log(translatedText);
	return translatedText;
};

const translateSpelling = (text, toBritish) => {
	let translatedText = text;
	const termsMap = toBritish
		? americanToBritishSpelling
		: britishToAmerican(americanToBritishSpelling);
	Object.keys(termsMap).forEach((key) => {
		const termRegex = new RegExp(`(\\s\|^)(${key})(\\s\|[.?!]$)`, 'gi');
		translatedText = translatedText.replaceAll(
			termRegex,
			`$1*${termsMap[key].replaceAll(/\s/g, '_')}$3`
		);
	});
	// console.log(translatedText);
	return translatedText;
};

const translateTitles = (text, toBritish) => {
	let translatedText = text;
	const termsMap = toBritish
		? americanToBritishTitles
		: britishToAmerican(americanToBritishTitles);
	Object.keys(termsMap).forEach((key) => {
		const termRegex = new RegExp(`(\\s\|^)(${key})(\\s\|[.?!]$)`, 'gi');
		translatedText = translatedText.replaceAll(
			termRegex,
			`$1*${termsMap[key]
				.split('')
				.map((letter, index) => (index == 0 ? letter.toUpperCase() : letter))
				.join('')}$3`
		);
	});
	// console.log(translatedText);
	return translatedText;
};

const translateTime = (text, toBritish) => {
	let translatedText = text;
	const timeRegex = toBritish
		? /([0-1]?[0-9])([:])([0-5][0-9])/g
		: /([0-1]?[0-9])([.])([0-5][0-9])/g;
	const separator = toBritish ? '.' : ':';
	translatedText = translatedText.replaceAll(timeRegex, `*$1${separator}$3`);
	// console.log(translatedText);
	return translatedText;
};

const wrapWords = (text) => {
	const wrappedText = text
		.split(' ')
		.map((section) => {
			const isTranslatedSection = section[0] === '*';
			if (isTranslatedSection) {
				const strippedWord = section.replace('*', '');
				return `<span class="highlight">${strippedWord}</span>`;
			} else {
				return section;
			}
		})
		.join(' ')
		.replaceAll('_', ' ');
	// console.log(wrappedText);
	return wrappedText;
};

class Translator {
	translate(text, locale) {
		const toBritish = locale === 'american-to-british';
		let translatedText = text;

		// console.log(new RegExp(`(\\s|^)(${locale})(\\s|p{P}$)`, 'gi'));

		translatedText = translateTerms(translatedText, toBritish);
		translatedText = translateSpelling(translatedText, toBritish);
		translatedText = translateTitles(translatedText, toBritish);
		translatedText = translateTime(translatedText, toBritish);
		const translatedCount = translatedText.match(/[*]/g);

		if (translatedCount) {
			translatedText = wrapWords(translatedText);
			return translatedText;
		} else {
			return 'Everything looks good to me!';
		}
	}
}

module.exports = Translator;
