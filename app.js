var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');

var app = express();

const con = require('./db')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

// GET /
app.get('/', (req, res) => {
  
  let products = []
  // No query from user - return all the products
  let query = "SELECT * FROM Product";

  // Specific search
  if (Object.keys(req.query).length != 0 && (req.query.name != '' || req.query.price != '')){
    query += ' WHERE ';
    // Name
    if (req.query.name != ''){
      query += `name LIKE '%${req.query.name}%'`
      if (req.query.price != '')
        query += " AND "
    }
    // Price
    if (req.query.price != '')
      query += `price = ${req.query.price}`
    query += ";"
  }
  
  con.query(query, (err, result) => {
    if (err) throw err;
    products = result
    res.render('index', {
        products: products
    })
  })
});

// GET /add
app.get('/add', (req, res) => {
  res.render('add');
});

// POST
app.post('/add', (req, res) => {
    let query = "INSERT INTO Product (name, price) VALUES ?";
    data = [
      [req.body.name, req.body.price]
    ]
    con.query(query, [data], (err, result) => {
        if (err) throw err;
        res.redirect('/')
    })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
