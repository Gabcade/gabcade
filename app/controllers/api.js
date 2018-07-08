// api.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
// const uuidv4 = require('uuid/v4');

const mongoose = require('mongoose');
const passport = require('passport');

const Announcement = mongoose.model('Announcement');
const Game = mongoose.model('Game');
const GamePlayer = mongoose.model('GamePlayer');
const GameInstance = mongoose.model('GameInstance');
const GameScore = mongoose.model('GameScore');

const GabcadeError = require('../gabcade-error');
const GabcadeService = require('../gabcade-service');

module.exports = (app, config) => {
  module.app = app;
  module.config = config;
  module.service = new GabcadeService(app, config);
  app.use('/api', router);
};

router.post('/authorize', (req, res, next) => {
  var viewModel = { };
  if (!req.user) {
    return next(new GabcadeError(403, 'Must have valid Gabcade session to authorize client'));
  }
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  Game
  .findOne({ accessToken: req.get('X-Gabcade-AccessToken') })
  .then((game) => {
    viewModel.game = game;
    return GamePlayer
    .findOne({
      game: game._id,
      user: req.user._id
    });
  })
  .then((player) => {
    if (!player) {
      return Promise.reject(new GabcadeError(403, 'Player has not authorized the game.'));
    }
    return res.status(200).json({
      userId: req.user._id,
      username: req.user.username
    });
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.post('/login', (req, res, next) => {
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
        return res.status(200).json({
          userId: user._id,
          username: user.username
        });
      });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Session ended successfully.' });
});

router.post('/game/start', (req, res) => {
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  console.log('request', req.body);
  Game
  .findOne({ accessToken: req.get('X-Gabcade-AccessToken') })
  .then((game) => {
    if (!game) {
      return Promise.reject(new GabcadeError(403, 'Invalid game access token'));
    }
    return GameInstance
    .create({
      game: game._id,
      user: req.user._id,
      startParams: req.body.startParams,
      note: req.body.note
    });
  })
  .then((gameInstance) => {
    res.status(200).json({
      created: gameInstance.created,
      instanceId: gameInstance._id,
      startParams: gameInstance.startParams,
      note: gameInstance.note
    });
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.post('/game/:instanceId/status', (req, res) => {
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  GameInstance
  .findById(req.params.instanceId)
  .then((gameInstance) => {
    if (!gameInstance) {
      return Promise.reject(new GabcadeError(404, 'Invalid game instance'));
    }
    if (gameInstance.user.toString() !== req.user._id.toString()) {
      return Promise.reject(new GabcadeError(403, 'Game instance belongs to another player'));
    }
    gameInstance.note = req.body.note;
    gameInstance.score = req.body.score;
    return gameInstance.save();
  })
  .then(( ) => {
    res.status(200).json({ message: 'Game update accepted' });
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.post('/game/:instanceId/achievement', (req, res) => {
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  GameInstance
  .findById(req.params.instanceId)
  .then((gameInstance) => {
    if (!gameInstance) {
      return Promise.reject(new GabcadeError(404, 'Invalid game instance'));
    }
    if (gameInstance.user !== req.user._id) {
      return Promise.reject(new GabcadeError(403, 'Game instance belongs to another user'));
    }
    gameInstance.achievements.push({
      name: req.body.achievement
    });
    return gameInstance.save();
  })
  .then(( ) => {
    res.status(200).json({ message: 'Game achievement accepted' });
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.post('/game/:instanceId/abort', (req, res) => {
  var viewModel = { };
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  GameInstance
  .findById(req.params.instanceId)
  .then((gameInstance) => {
    if (!gameInstance) {
      return Promise.reject(new GabcadeError(404, 'Invalid game instance'));
    }
    if (gameInstance.user !== req.user._id) {
      return Promise.reject(new GabcadeError(403, 'Game instance belongs to another user'));
    }
    gameInstance.state = 'aborted';
    return gameInstance.save();
  })
  .then((gameInstance) => {
    viewModel.gameInstance = gameInstance;
    res.status(200).json(viewModel);
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.post('/game/:instanceId/finish', (req, res) => {
  var viewModel = { };
  console.log('X-Gabcade-AccessToken', req.get('X-Gabcade-AccessToken'));
  console.log('X-Gabcade-HMAC', req.get('X-Gabcade-HMAC'));
  GameInstance
  .findById(req.params.instanceId)
  .then((gameInstance) => {
    if (!gameInstance) {
      return Promise.reject(new GabcadeError(404, 'The game instance does not exist.'));
    }
    if (gameInstance.user.toString() !== req.user._id.toString()) {
      return Promise.reject(new GabcadeError(403, 'Game instance belongs to another user'));
    }
    gameInstance.state = 'finished';
    gameInstance.note = req.body.note;
    gameInstance.score = req.body.score;
    return gameInstance.save();
  })
  .then((gameInstance) => {
    viewModel.gameInstance = gameInstance;
    return GameScore
    .create({
      created: gameInstance.created,
      game: gameInstance.game,
      user: req.user._id,
      score: req.body.score,
      note: req.body.note
    });
  })
  .then(( ) => {
    res.status(200).json({ message: 'Game finish report accepted' });
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});

router.get('/game/leaderboard', (req, res, next) => {
  var viewModel = { };
  if (!req.query.p) {
    req.query.p = 1;
  }
  if (!req.query.cpp) {
    req.query.cpp = 10;
  }
  Game
  .findOne({ accessToken: req.get('X-Gabcade-AccessToken') })
  .select('title headline')
  .then((game) => {
    if (!game) {
      return new Promise.reject(new GabcadeError(403, 'Invalid game access token'));
    }
    viewModel.game = game;
    return GameScore
    .find({ game: game._id })
    .sort({ score: -1 })
    .limit(req.query.cpp)
    .skip((req.query.p - 1) * req.query.cpp);
  })
  .then((scores) => {
    viewModel.leaderboard = {
      p: req.query.p,
      cpp: req.query.cpp,
      scores: scores
    };
    res.status(200).json(viewModel);
  })
  .catch(next);
});

router.get('/game/announcements', (req, res) => {
  var viewModel = { };
  Game
  .findOne({ accessToken: req.get('X-Gabcade-AccessToken') })
  .select('title')
  .then((game) => {
    if (!game) {
      return Promise.reject(new GabcadeError(403, 'Invalid game access token'));
    }
    viewModel.game = game;
    return Announcement
    .find({ game: game._id })
    .populate('owner');
  })
  .then((announcements) => {
    viewModel.announcements = announcements;
    res.status(200).json(viewModel);
  })
  .catch((error) => {
    res
    .status(error.code || error.statusCode || 500)
    .json(error);
  });
});
