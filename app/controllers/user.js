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
const StripeStrategy = require('passport-stripe').Strategy;

const User = mongoose.model('User');
const Comment = mongoose.model('Comment'); // jshint ignore:line

const OpusService = require('../opus-service');
const uuidv4 = require('uuid/v4');

class UserController extends OpusService {

  constructor (app, config) {
    super(app, config);
    var self = this;

    router.use((req, res, next) => {
      res.locals.currentView = 'profile';
      next();
    });

    router.param('username', (req, res, next, username) => {
      User
      .findOne({ username_lc: username })
      .then((user) => {
        if (!user) {
          return Promise.reject(
            new Error(`User '${username}' does not exist.`)
          );
        }
        res.locals.profile = user;
        next();
      })
      .catch(next);
    });

    router.post('/dismiss-alert/:alertId', self.dismissAlert.bind(self));
    router.post('/login', self.login.bind(self));
    router.post('/:username', self.updateUser.bind(self));
    router.post('/', self.createUser.bind(self));

    router.get('/stripe/connect', passport.authenticate('stripe'));
    router.get('/stripe/callback', self.onStripeCallback.bind(self));

    router.get('/signup', self.getUserSignupForm.bind(self));
    router.get('/login', self.getLoginForm.bind(self));
    router.get('/logout', self.logout.bind(self));

    router.get('/:username/edit', self.getUserEditForm.bind(self));
    router.get('/:username', self.getUser.bind(self));
    router.get('/', self.redirectUser.bind(self));
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

  updateUser (req, res, next) {
    res.locals.profile.bio = req.body.bio;
    res.locals.profile
    .save()
    .then((user) => {
      res.locals.user = user;
      res.redirect(`/user/${res.locals.profile.username_lc}`);
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

  dismissAlert (req, res) {
    if (!req.user) {
      return res.status(403).json({
        message: 'Players must be authenticated to dismiss alerts. It is how we know who you are.'
      });
    }
    if (req.params.alertId === 'gdpr') {
      req.user.flags.isGdprDismissed = true;
    } else {
      return res.status(404).json({
        message: `${req.params.alertId} is not a known alert. Stop it or I will entirely ban you and know who you are.`
      });
    }
    req.user
    .save()
    .then(( ) => {

    })
    .catch((error) => {
      console.log('GDPR error', error);
      res.status(500).json({
        message: 'Everything must be entirely broken or something. Quit trying.'
      });
    });
  }

  onStripeCallback (req, res, next) {
    passport.authenticate('stripe', { }, (err, stripeUser) => {
      req.user.stripe.customerId = stripeUser.id;
      req.user.stripe.accessToken = stripeUser.accessToken;
      req.user.stripe.refreshToken = stripeUser.refreshToken;
      req.user
      .save()
      .then(( ) => {
        res.redirect('/stripe/subscribe');
      })
      .catch(next);
    })(req, res, next);
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
        user.lastLogin = new Date(Date.now());
        user
        .save()
        .then(( ) => {
          return res.redirect(`/user/${user.username}`);
        });
      });
    })(req, res, next);
  }

  logout (req, res) {
    req.logout();
    res.redirect('/user/login');
  }

  getUserEditForm (req, res, next) {
    var viewModel = { };
    User
    .findOne({ username_lc: req.params.username.toLowerCase() })
    .then((user) => {
      viewModel.profile = user;
      res.render('user/edit', viewModel);
    })
    .catch(next);
  }

  getUser (req, res, next) {
    var viewModel = { };
    User
    .findOne({ username_lc: req.params.username.toLowerCase() })
    .then((user) => {
      viewModel.profile = user;
      return Comment
      .find({ author: user._id })
      .sort({ created: -1 })
      .limit(10)
      .populate('subject')
      .populate('author');
    })
    .then((comments) => {
      viewModel.comments = comments;
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
  app.use('/user', router);

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
    console.log('Passport.serializeUser', user);
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

  console.log('registering PassportJS Stripe strategy');
  passport.use(new StripeStrategy({
      clientID: process.env.STRIPE_CLIENT_ID,
      clientSecret: process.env.STRIPE_SECRET_KEY,
      callbackUrl: config.stripe.callbackUrl
    },
    function (accessToken, refreshToken, stripe_properties, done) {
      console.log('STRIPE', {
        accessToken: accessToken,
        refreshToken: refreshToken,
        properties: stripe_properties
      });
      done(null, {
        id: stripe_properties.stripe_user_id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        properties: stripe_properties
      });
    }
  ));
};
