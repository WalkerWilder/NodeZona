const fs = require('fs');

const teste = () => {return 15348};
const headers = () => {
	let headers = fs.readFileSync('views/body.html','UTF8');
	return headers;
}

module.exports = { teste, headers };