'use strict';

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const express = require('express');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');

const session = require('express-session');
const RedisSessionStore = require('connect-redis')(session);
const passport = require('passport');

const markdown = require('markdown').markdown;
const moment = require('moment');
const numeral = require('numeral');

module.exports = (app, config) => {
  const env = process.env.NODE_ENV || 'development';
  const log = app.locals.log;

  app.locals.config = config;
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env === 'development' || env === 'local';
  
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

  app.use(favicon(path.join(config.root, 'public', 'img', 'favicon.ico')));

  var logDirectory = path.join(config.root, 'logs');
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
  var accessLogStream = rfs('gabcade-access.log', {
    size: '25M',
    interval: '1d',
    path: logDirectory,
    compress: 'gzip'
  });
  app.use(logger(app.locals.ENV_DEVELOPMENT ? 'dev' : 'combined', {
    stream: accessLogStream,
    skip: (req, res) => {
      return (req.url === '/') && (res.statusCode < 400);
    }
  }));
  if (app.locals.ENV_DEVELOPMENT) {
    app.use(logger('dev', {
      skip: (req, res) => {
        return (req.url === '/') && (res.statusCode < 400);
      }
    }));
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(path.join(config.root, 'public')));
  app.use('/moment', express.static(path.join(config.root, 'node_modules', 'moment', 'min')));
  app.use('/chart', express.static(path.join(config.root, 'node_modules', 'chart.js', 'dist')));
  app.use(methodOverride());

  app.set('trust proxy', 1);
  log.info('initializing redis session store');
  var sessionStore = new RedisSessionStore(config.redis);
  config.http.session.store = sessionStore;
  config.https.session.store = sessionStore;
  app.use(session(config.http.session));

  log.info('initializting PassportJS');
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.numeral = numeral;
    res.locals.moment = moment;
    res.locals.markdown = markdown;
    /*
     * truncateText
     * Accepts a body of text from the template and possibly truncates it. If
     * so, it will append an ellipsis. CSS should do this, but I guess that's
     * hard.
     */
    res.locals.truncateText = (text, maxWords) => {
      var out = [ ];
      var words = text.split(' ');
      while (words.length && (out.length < maxWords)) {
        out.push(words.shift());
      }
      if (out.length === maxWords) {
        return out.join(' ') + '...';
      }
      return out.join(' ');
    };

    next();
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    var pathObj = path.parse(controller);
    log.info('Loading controller', { controller: pathObj.name });
    require(controller)(app, config);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.locals.ENV_DEVELOPMENT) {
    app.use((err, req, res, next) => { // jshint ignore:line
      log.error(err.message || 'Gabcade error', { url: req.url, error: err });
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use((err, req, res, next) => { // jshint ignore:line
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });

  return app;
};
