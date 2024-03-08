const express = require('express');
const helmet = require('helmet');

const app = express();
const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(helmet.hidePoweredBy()); // hide powered by express in header
app.use(helmet.frameguard({ action: 'deny' })); // prevent iframe abuse
app.use(helmet.xssFilter()); // sanitize user input
app.use(helmet.noSniff()); // prevent MIME sniffing to override the 'content-type' of a header
app.use(helmet.ieNoOpen()); // sets X-Download-Options header to noopen, prevent IE users from executing downloads
app.use(helmet.hsts({ maxAge: ninetyDaysInSeconds, force: true })); // enforce hsts for the next 90 days
app.use(helmet.dnsPrefetchControl()); // prevents dns prefetching of links on a page when it loads
app.use(helmet.noCache()); // attempt to disable page cache to always load from scatch
app.use(
	helmet.contentSecurityPolicy({
		// set trusted sources for content
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", 'trusted-cdn.com'],
		},
	})
);

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Your app is listening on port ${port}`);
});
