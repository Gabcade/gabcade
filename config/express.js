'use strict';

const express = require('express');
const glob = require('glob');

// const favicon = require('serve-favicon');
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

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.set('trust proxy', 1);
  console.log('initializing redis session store');
  var sessionStore = new RedisSessionStore(config.redis);
  config.http.session.store = sessionStore;
  config.https.session.store = sessionStore;
  app.use(session(config.http.session));

  console.log('initializting PassportJS');
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.numeral = numeral;
    res.locals.moment = moment;
    res.locals.markdown = markdown;
    next();
  });

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach((controller) => {
    require(controller)(app, config);
  });

  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if (app.locals.ENV_DEVELOPMENT) {
    app.use((err, req, res, next) => { // jshint ignore:line
      console.log(err);
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
