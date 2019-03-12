const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const querystring = require('querystring');
const path = require('path');
const db = require('./db.js');

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
		if (req.path != '/login.html') {
			res.redirect(req.path);
		} else {
			res.redirect('/index.html');
		}
	} else {
		next();
	}
};

app.route('/login.html*')
.get(sessionChecker, (req, res) => {
	res.sendFile(__dirname + '/public/login.html');
})
.post( async (req, res) => {
	const { verificaAcesso } = require('./controllers/usuarios.js');
	const username = req.body.username;
	const password = req.body.password;
	let acesso = await verificaAcesso(username, password);
	switch (acesso) {
		case 1:
			req.session.user = {username, password};
			res.redirect(req.params[0] || '/index.html');
			break;
		case -1:
			console.log({erro:{username, password}});
			break;
		case 0:
			res.redirect(req.path);
			break;
		default:
			res.redirect(req.path);
			break;
	}
});

app.get('/logout.html', (req, res) => {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
		res.redirect('/login.html');
	} else {
		res.redirect('/login.html');
	}
});

app.get('/*', (req, res) => {
	if (fs.existsSync('public' + req.path) && path.extname('public' + req.path)) {
		res.sendFile('/public' + req.path, {root: __dirname})
	} else if (fs.existsSync('public' + req.path + '/index.html') || fs.existsSync('public' + req.path + 'index.html')) {
		res.sendFile('/public' + (req.path + '/index.html').replace('//','/'), {root: __dirname});
	} else if (fs.existsSync('private' + req.path) && path.extname('private' + req.path)) {
		if (req.session.user && req.cookies.user_sid) {
			res.sendFile('/private' + req.path, {root: __dirname})
		} else {
			res.redirect('/login.html?' + querystring.stringify({'origem': req.path}));
		}
	} else if (fs.existsSync('private' + req.path + '/index.html') || fs.existsSync('private' + req.path + 'index.html')) {
		if (req.session.user && req.cookies.user_sid) {
			res.sendFile('/private' + (req.path + '/index.html').replace('//','/'), {root: __dirname})
		} else {
			res.redirect('/login.html?' + querystring.stringify({'origem': (req.path + '/index.html').replace('//','/')}));
		}
	} else {
		res.sendStatus(404);
		res.end();
	}
})
app.post('/*.js', (req, res) => {
	let funcao = req.headers.func;
	const ret = require('./controllers' + req.path)[funcao]();
	res.write(JSON.stringify(ret));
	res.end();
	return;
})

app.listen(3000, () => console.log('Server ready'))