const fs = require('fs');

const headers = async (req, res) => {
	let headers = fs.readFileSync('views/body.html','UTF8');
	res.write(JSON.stringify(headers));
	res.end();
}

module.exports = { headers };