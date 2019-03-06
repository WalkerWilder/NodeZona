const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
	key: 'user_sid',
	secret: '123456',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000
	}
}));

app.use((req, res, next) => {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');
	}
	next();
});

var sessionChecker = (req, res, next) => {
	if (req.session.user && req.cookies.user_sid) {
		res.redirect('/seila.html');
	} else {
		next();
	}
};

app.route('/login.html')
.get(sessionChecker, (req, res) => {
	res.sendFile(__dirname + '/public/login.html');
})
.post((req, res) => {
	req.session.user = {username: req.body.username, password: req.body.password};
	res.redirect('/seila.html');
});

app.get('/logout.html', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/login.html');
	} else {
		res.redirect('/login.html');
	}
});

app.use(express.static('public'))
app.get('/', (req, res) => res.send('Como você chegou aqui?'))
app.get('/*', (req, res) => {
	if (fs.existsSync(req.path)) {
		res.sendfile(req.path, { root: 'C:/node/webserver' })
	} else {
		res.sendStatus(404);
	}
	res.end();
})
app.post('/*.js', (req, res) => {
	let funcao = req.headers.func;
	const ret = require('./controllers' + req.path)[funcao]();
	res.write(JSON.stringify(ret));
	res.end();
	return;
})

app.listen(3000, () => console.log('Server ready'))