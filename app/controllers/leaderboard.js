// leaderboard.js
// Copyright (C) 2018 theSCOREX, Inc.
// All Rights Reserved

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const GameScore = mongoose.model('GameScore');
const Game = mongoose.model('Game');

module.exports = (app, config) => {
  module.app = app;
  module.config = config;
  module.log = app.locals.log;

  module.log.info('mounting leaderboard service');
  app.use('/leaderboard', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'leaderboard';
  next();
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Game
  .find()
  .sort({ title: 1 })
  .lean()
  .then((games) => {
    viewModel.games = games;
    var jobs = [ ];
    games.forEach((game) => {
      jobs.push(
        GameScore
        .find({ game: game })
        .sort({ score: -1 })
        .limit(10)
        .populate('user')
        .lean()
        .then((scores) => {
          game.leaderboard = scores;
        })
      );
    });
    return Promise.all(jobs);
  })
  .then(( ) => {
    res.render('leaderboard/index', viewModel);
  })
  .catch(next);
});