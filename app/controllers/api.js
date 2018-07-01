// api.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Announcement = mongoose.model('Announcement');
const Game = mongoose.model('Game');
const GamePlayer = mongoose.model('GamePlayer');
const GameScore = mongoose.model('GameScore');

const GabcadeError = require('../gabcade-error');
const GabcadeService = require('../gabcade-service');

module.exports = (app, config) => {
  module.app = app;
  module.config = config;
  module.service = new GabcadeService(app, config);
  app.use('/api', router);
};

router.post('/game/:slug/add-user', (req, res,next) => {
  var viewModel = { };
  Game
  .findOne({ slug: req.params.slug })
  .select('title')
  .then((game) => {
    if (!game) {
      return Promise.reject(
        new GabcadeError(404, 'The selected game does not exist.')
      );
    }
    viewModel.game = game;
    return GamePlayer
    .create({
      game: game._id,
      user: req.user._id
    });
  })
  .then(( ) => {
    return Game.update(
      { _id: viewModel.game._id },
      { $inc: { 'stats.players': 1 } }
    );
  })
  .then(( ) => {
    res.redirect(`/game/${req.params.slug}/player`);
  })
  .catch(next);
});

router.post('/game/:slug/score', (req, res, next) => {
  Game
  .findOne({ slug: req.params.slug })
  .select('title')
  .then((game) => {
    if (!game) {
      return Promise.reject(new GabcadeError(
        404,
        'The selected game does not exist.'
      ));
    }
    return GameScore
    .create({
      game: game._id,
      user: req.user._id,
      score: req.body.score
    });
  })
  .then(( ) => {
    res.status(200).json({
      code: 200,
      message: 'Score processed'
    });
  })
  .catch(next);
});

router.get('/game/:slug/leaderboard', (req, res, next) => {
  var viewModel = { };
  if (!req.query.p) {
    req.query.p = 1;
  }
  if (!req.query.cpp) {
    req.query.cpp = 10;
  }
  Game
  .findOne({ slug: req.params.slug })
  .select('title')
  .then((game) => {
    if (!game) {
      return new Promise.reject(new GabcadeError(
        404,
        'The selected game does not exist'
      ));
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

router.get('/game/:slug/announcements', (req, res, next) => {
  var viewModel = { };
  Game
  .findOne({ slug: req.params.slug })
  .select('title')
  .then((game) => {
    if (!game) {
      return Promise.reject(new GabcadeError(
        404, 'The selected game does not exist'
      ));
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
  .catch(next);
});

router.get('/game/:slug/add-user', (req, res, next) => {
  var viewModel = { };
  Game
  .findOne({ slug: req.params.slug })
  .select('-authToken -accessToken')
  .populate('user')
  .then((game) => {
    viewModel.game = game;
    res.render('api/add-user', viewModel);
  })
  .catch(next);
});