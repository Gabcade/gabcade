// game.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Game = mongoose.model('Game');
const Comment = mongoose.model('Comment'); // jshint ignore:line
const Impression = mongoose.model('Impression');

module.exports = (app) => {
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

router.get('/:slug', (req, res, next) => {
  var viewModel = { };
  if (!res.locals.game.stats) {
    res.locals.game.stats = { };
  }

  Impression
  .create({
    subjectType: 'Game',
    subject: res.locals.game._id,
    user: req.user
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
