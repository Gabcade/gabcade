// app.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const config = require('./config/config');
const glob = require('glob');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Twitter = require('twitter');

mongoose.connect(config.db, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

const app = express();
app.locals.twitter = new Twitter(config.twitter);

module.exports = require('./config/express')(app, config);

app.listen(config.http.listen.port, config.http.listen.host, 256, () => {
  console.log('Express server listening on port ' + config.port);
});
