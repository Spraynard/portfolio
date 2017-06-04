var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
//Custom Cookie Divider Module
var cookieDivide = require('./cookieDivider');
// mySQL custom export
var mySQL = require('./my_sql_setup.js');
//Routing for index page
var index = require('./routes/index');
//Routing for users page
var users = require('./routes/users');
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
//Routing for a new post in a blog

var app = express();
// APP LOCALS
// Setting the name of the actual website
app.locals.websiteName = "Website Name";
app.locals.moment = require('moment');
app.locals.postID = null;
app.locals.projectID = null;
app.locals.postID = null;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// upload folder setup?
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

//Set up of client side jQuery path
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// Function to `blurb` the body of a post if it needs it :3
function blurber(body) {
  if (body.length > 50) {
    body = body.substring(0, 50) + '...';
  }
  return body;
}
// Set up application local cache of footerPosts
// Set up of request-wide locals
app.use((req, res, next) => {
  // Want to have a variable footerPosts
  mySQL.getConn(function(err, connection) {
    if (err) throw err;
    connection.query("SELECT ID, title, body FROM post ORDER BY ID DESC LIMIT 2", function(err, results, fields) {
      connection.release();
      res.locals.footerPosts = results;
      next();
    })
  })
})

app.use('/', index);
app.use('/users', users);
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

app.listen(8000).on('error', function(err) {
	console.error(err)
})

// module.exports = app;