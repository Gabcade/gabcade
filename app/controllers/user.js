// user.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const path = require('path');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

const OpusService = require('../opus-service');
const uuidv4 = require('uuid/v4');

class UserController extends OpusService {

  constructor (app, config) {
    super(app, config);
    var self = this;

    router.post('/login', self.login.bind(self));
    router.post('/', self.createUser.bind(self));

    router.get('/signup', self.getUserSignupForm.bind(self));
    router.get('/login', self.getLoginForm.bind(self));
    router.get('/logout', self.logout.bind(self));

    router.get('/:username', self.getUser.bind(self));
    router.get('/', self.redirectUser.bind(self));

    app.use('/user', router);
  }

  createUser (req, res, next) {
    var viewModel = { };
    var self = this;
    
    if (!req.body.email || (typeof req.body.email !== 'string') || (req.body.email.length <= 0)) {
      return res.status(500).json({ error: 'Must include an email address.' });
    }
    if (!req.body.username || (typeof req.body.username !== 'string') || (req.body.username.length <= 0)) {
      return res.status(500).json({ error: 'Must include a username' });
    }
    if (!req.body.password || (typeof req.body.password !== 'string') || (req.body.password.length <= 0)) {
      return res.status(500).json({ error: 'Must include a password' });
    }

    req.body.passwordSalt = uuidv4();
    req.body.password = self.maskPassword(req.body.passwordSalt, req.body.password);
    req.body.username_lc = req.body.username.toLowerCase();

    User
    .create(req.body)
    .then((user) => {
      viewModel.user = user;
      var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      return self.
      getLocationV4({ simple: true, address: ipAddress })
      .then((geo) => {
        viewModel.geo = geo;
        return Promise.resolve();
      })
      .catch((error) => {
        console.log('geoip error', error);
        return Promise.resolve();
      });
    })
    .then(( ) => {
      req.login(viewModel.user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    })
    .catch(next);
  }

  getLocationV4 (options) {
    var self = this;
    if (options.simple) {
      return self.geolocateSimple(options);
    }
    return self.geolocate(options);
  }

  geolocateSimple (options) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.geoip2.lookupSimple(options.address, function (err, result) {
        if (err) {
          err.status = 500;
          return reject(err);
        }
        if (!result) {
          err = new Error('no location entry for address: ' + options.address.toString());
          err.status = 404;
          return reject(err);
        }
        result.address = options.address;
        resolve(result);
      });
    });
  }

  geolocate (options) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.geoip2.lookup(options.address, function (err, result) {
        if (err) {
          err.status = 500;
          return reject(err);
        }
        if (!result) {
          err = new Error('no location entry for address: ' + options.address.toString());
          err.status = 404;
          return reject(err);
        }
        result.address = options.address;
        resolve(result);
      });
    });
  }

  getUserSignupForm (req, res) {
    res.render('user/signup');
  }

  getLoginForm (req, res) {
    res.render('user/login');
  }

  login (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error(info.message));
      }
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect(`/user/${user.username}`);
      });
    })(req, res, next);
  }

  logout (req, res) {
    req.logout();
    res.redirect('/user/login');
  }

  getUser (req, res, next) {
    var viewModel = { };
    User
    .findOne({ username_lc: req.params.username.toLowerCase() })
    .then((user) => {
      viewModel.profile = user;
      res.render('user/profile', viewModel);
    })
    .catch(next);
  }

  redirectUser (req, res) {
    if (req.user) {
      return res.redirect(`/user/${req.user.username}`);
    }
    res.redirect('/user/login');
  }
}

module.exports = (app, config) => {
  var controller = new UserController(app, config);
  var dbpath = path.join(
    config.root,
    'node_modules',
    'geoip2',
    'databases',
    'GeoLite2-City.mmdb'
  );

  console.log('loading GeoLite2-City.mmdb');
  controller.geoip2 = require('geoip2');
  controller.geoip2.init(dbpath);

  passport.serializeUser(function (user, done) {
    done(null, user._id || user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  console.log('registering PassportJS local strategy');
  passport.use(new LocalStrategy((username, password, done) => {
    var incorrectPasswordMessage, userNotFoundMessage;
    if (app.locals.ENV_DEVELOPMENT) {
      userNotFoundMessage = 'The user does not exist.';
      incorrectPasswordMessage = 'The password entered is not correct.';
    } else {
      userNotFoundMessage = incorrectPasswordMessage = 'The information entered does not match our records.';
    }
    User
    .findOne({ username_lc: username.toLowerCase() }, '+password +passwordSalt')
    .then((user) => {
      if (!user) {
        return done(null, false, { message: userNotFoundMessage });
      }
      if (user.password !== controller.maskPassword(user.passwordSalt, password)) {
        return done(null, false, { message: incorrectPasswordMessage });
      }
      return done(null, user);
    });
  }));
};
