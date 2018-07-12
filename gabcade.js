// gabcade.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const config = require('./config/config');
const glob = require('glob');
const path = require('path');

const log = require(path.join(config.root, 'gabcade-winston'))(config);
log.info("Gabcade.com Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>");
log.info("License: MIT");

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(config.db, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  var pathObj = path.parse(model);
  log.info('Loading model', { model: pathObj.name });
  require(model);
});

const app = express();
app.locals.config = config;
app.locals.log = log;

module.exports = require('./config/express')(app, config);

app.listen(config.http.listen.port, config.http.listen.host, 256, () => {
  log.info('Gabcade.com server listening', { port: config.port });
});
