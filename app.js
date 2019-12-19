// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var adaro = require('adaro');

const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');

const appRouter = require('./src/router');
const Limit = require('./src/util/frequecyLimit');
const login = require('./routes/login');
const paramParse = require('./src/util/handleParams');
const urlLog = require('./src/util/urlLog');

var app = express();

// view engine setup
app.engine('dust', adaro.dust());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

app.use(logger('dev'));
app
	.all('*', function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
		res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Credentials', true);
		res.header('X-Powered-By', ' 3.2.1');
		if (req.method == 'OPTIONS') res.send(200); /*让options请求快速返回*/
		else next();
	})
	// session
	.use(session({
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 30 * 2 // 2 months
		},
		resave: true,
		saveUninitialized: false,
		secret: 'yingyingying'
	}))
	// icon
	.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
	.use(express.static(path.join(__dirname, 'public')))
	// 限制频率
	.use(Limit);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
// 日志
app.use((req, res, next) => {
	urlLog(req);
	next();
});
app.use(paramParse);

// 应用路由
app.use('/', appRouter);
app.use('/login', login);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') === 'development' ? err : {};

// 	// render the error page
// 	res.status(err.status || 500);
// 	res.render('error');
// 	next();
// });


module.exports = app;