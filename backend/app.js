var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var addDataRouter = require('./routes/add_data');
var errorRouter = require('./routes/error');

const releaseConnection = require('./components/releaseConnection')


var app = express();

app.use(cors({credentials: true, origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://127.0.0.1:3000']}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(releaseConnection);
app.use('/add_data', addDataRouter);
app.use('/*', errorRouter);

module.exports = app;
