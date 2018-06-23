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

router.get('/:gameSlug', (req, res/*, next*/) => {
  var viewModel = {
    slug: req.params.gameSlug,
    title: 'NUCLEOID',
    engineFile: '78586924f8856bbad7e15767a691574a.js',
    configFile: '650ffa3f67fee8162f343ecb428f691c.json'
  };
  switch (req.params.gameSlug) {
    case 'nucleoid':
      res.render('game/unity-player', viewModel);
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
