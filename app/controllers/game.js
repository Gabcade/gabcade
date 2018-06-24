// game.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

module.exports = (app) => {
  app.use('/games', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'games';
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

router.get('/:slug', (req, res, next) => {
  var viewModel = { };
  if (!res.locals.game.stats) {
    res.locals.game.stats = { };
  }
  res.locals.game.stats.impressions += 1;
  res.locals.game
  .save()
  .then((game) => {
    viewModel.game = game;
    console.log(game);
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
  .limit(10)
  .then((games) => {
    viewModel.games = games;
    res.render('game/index', viewModel);
  })
  .catch(next);
});
