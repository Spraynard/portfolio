var express = require('express');
var minifyHTML = require('express-minify-html');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var helmet = require('helmet');
//Custom Cookie Divider Module
var cookieDivide = require('./cookieDivider');
// mySQL custom export
var mySQL = require('./my_sql_setup.js');
//Routing for index page
var index = require('./routes/index');
//Routing for projects page
var projects = require('./routes/projects');
//Routing for Contact Page
var contact = require('./routes/contact');
//Routing for Admin Login Page
var login = require('./routes/login');
//Routing for Logout Page
var logout = require('./routes/logout');
//Routing for Blog Page
var blog = require('./routes/blog');

var app = express();

// APP LOCALS
// Setting the name of the actual website
app.locals.websiteName = "Kellan Martin";
app.locals.moment = require('moment');
app.locals.postID = null;
app.locals.projectID = null;
app.locals.postID = null;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}));

// upload folder setup?
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public/src/'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));

//Set up of client side jQuery path
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// Set up application local cache of footerPosts
// Set up of request-wide locals
app.use((req, res, next) => {
  // Want to have a variable footerPosts
  mySQL.getConn(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT ID, title, url_title, body FROM post ORDER BY ID DESC LIMIT 2", function(err, results, fields) {
      connection.release();
      res.locals.footerPosts = results;
      next();
    })
  })
})

app.use('/', index);
app.use('/projects', projects);
app.use('/contact', contact);
app.use('/blog', blog);
app.get('/thanks', function(req, res, next) {
  res.render('thankyou')
});

//Login page for admin mode
app.use('/admin/login', login);
//Logout page
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
