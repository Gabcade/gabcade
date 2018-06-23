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

router.get('/:gameSlug', (req, res/*, next*/) => {
  var viewModel = {
    slug: req.params.gameSlug
  };
  switch (req.params.gameSlug) {
    case 'nucleoid':
      res.render('game/player', viewModel);
      break;
    case 'gabber':
      res.render('game/gabber', viewModel);
      break;
    case 'gaboom':
      res.render('game/gaboom', viewModel);
      break;
    case 'icann-command':
      res.render('game/icann-command', viewModel);
      break;
  }
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
