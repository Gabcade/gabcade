// game.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Game = mongoose.model('Game');
const GamePlayer = mongoose.model('GamePlayer');
const Comment = mongoose.model('Comment'); // jshint ignore:line
const Impression = mongoose.model('Impression');

const GabcadeError = require('../gabcade-error');
const GabcadeService = require('../gabcade-service');

module.exports = (app, config) => {
  module.app = app;
  module.config = config;
  module.service = new GabcadeService(app, config);
  app.use('/game', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'game';
  next();
});

router.param('slug', (req, res, next, slug) => {
  Game
  .findOne({ slug: slug })
  .populate('team')
  .then((game) => {
    res.locals.game = game;
    next();
  })
  .catch(next);
});

router.post('/:slug/add-user', (req, res,next) => {
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

router.get('/:slug/add-user', (req, res, next) => {
  var viewModel = { };
  Game
  .findOne({ slug: req.params.slug })
  .select('-authToken -accessToken')
  .populate('user')
  .then((game) => {
    viewModel.game = game;
    res.render('game/add-user', viewModel);
  })
  .catch(next);
});

router.get('/:slug/discuss', (req, res, next) => {
  var viewModel = { game: res.locals.game };
  Comment
  .find({ subject: viewModel.game._id })
  .sort({ created: -1 })
  .limit(25)
  .populate('subject')
  .populate('author')
  .then((comments) => {
    viewModel.comments = comments;
    res.render('game/discuss', viewModel);
  })
  .catch(next);
});

router.get('/:slug/player', (req, res, next) => {
  var viewModel = { };
  if (!req.user) {
    return res.redirect(`/user/signup?game=${req.params.slug}`);
  }
  GamePlayer
  .find({
    game: res.locals.game._id,
    user: req.user._id
  })
  .then((gamePlayer) => {
    viewModel.gamePlayer = gamePlayer;
    return Impression
    .create({
      subjectType: 'Game',
      subject: res.locals.game._id,
      user: req.user
    });
  })
  .then((impression) => {
    viewModel.impression = impression;
    return Game
    .findByIdAndUpdate(
      res.locals.game._id,
      { $inc: { 'stats.impressions': 1 } },
      { new: true }
    );
  })
  .then((game) => {
    viewModel.game = game;

    switch (game.technology) {
      case 'U3':
        res.render('game/unity-player', viewModel);
        break;
    }
  })
  .catch(next);
});

router.get('/:slug', (req, res, next) => {
  if (!req.user) {
    return res.redirect(`/user/signup?game=${req.params.slug}`);
  }
  GamePlayer
  .findOne({
    game: res.locals.game._id,
    user: req.user._id
  })
  .then((gamePlayer) => {
    if (!gamePlayer) {
      return res.redirect(`/game/${res.locals.game.slug}/add-user`);
    }
    return res.redirect(`/game/${res.locals.game.slug}/player`);
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  var viewModel = {
    slug: 'nucleoid'
  };
  Game
  .find()
  .sort({ title: 1 })
  .limit(10)
  .then((games) => {
    viewModel.games = games;
    res.render('game/index', viewModel);
  })
  .catch(next);
});
