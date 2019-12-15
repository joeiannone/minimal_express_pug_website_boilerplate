const
	express = require('express'),
	fs = require('file-system'),
	https = require('https'),
	bodyParser = require('body-parser'),
	evalidator = require('email-validator'),
	mailer = require('sendmail')(),
	bcrypt = require('bcrypt'),
	session = require('express-session'),
	db = require('./db/config.js'),
	multipart = require('connect-multiparty');

const bcryptSaltRounds = 10;

const db_site_version = 1;

// for uploading files
const multipartMiddleware = multipart();

// app instance
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));


// sesh stuff
app.use(
	session({
		secret: '',
		resave: false,
		saveUninitialized: false
	})
);

app.use(function (req, res, next) {
	req.session.user_ip = req.ip;
	req.session.last_access = Date.now();
  next();
})

app.listen(4000, "localhost");
console.log('...listening on 4000');

let view_data = {
	title: '',
};

app.get('/', function(req, res) {
	res.render('index', view_data);
});


app.get('/login', function(req, res) {
	if (req.session.user) {
		if (req.session.user.admin) res.redirect('/admin');
		else res.redirect('/');
	} else res.render('login', view_data);
});

app.get('/logout', function(req, res) {
	delete req.session.user;
	res.redirect("/login");
});

app.get('/admin', function(req, res) {
	if (req.session.user && req.session.user.admin) {
		view_data.username = req.session.user.username;
		view_data.email = req.session.user.email;
		res.render('admin', view_data);
	} else
		res.redirect("/");
});

app.get('/sitedatas', function(req, res) {
	if (req.session.user && req.session.user.admin){
		db.SiteDataModel.findOne({site_version: db_site_version}, function (err, siteDatas) {
			if (siteDatas) res.json({success: siteDatas});
			else res.json({failure: 1});
		});
	} else
		res.redirect("/");
});


app.get('/session', function (req, res) {
	let session = req.session;
	if (session.user) delete session.user.password;
	res.json({success: session});
});





app.post('/login', function(req, res) {
	db.UserModel.findOne({username: req.body.username}, function (err, user) {
		if (user) {
			// found user
			bcrypt.compare(req.body.password, user.password).then(function(result) {
				if (result) {
					req.session.user = user;
					res.json({success: req.session.user});
				} else res.json({failure: 1});
			});
		} else {
			res.json({failure: 1});
		}
	});

});


app.post('/sitedatas', function(req, res) {
	db.SiteDataModel.updateOne({site_version: db_site_version}, {/* define updated site datas here */}, function(err, result) {
		if (result) res.json({success: req.body});
		else res.json({failure: 1});
	});
});



/* stays at bottom */
app.get('/:notfound', function(req, res) {
	res.redirect('/');
});
