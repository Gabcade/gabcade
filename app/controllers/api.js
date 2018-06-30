// api.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');
const GamePlayer = mongoose.model('GamePlayer');

module.exports = (app, config) => {
  module.app = app;
  module.config = config;
  app.use('/api', router);
};

router.post('/game/:slug/add-user', (req, res,next) => {
  var viewModel = { };
  Game
  .findOne({ slug: req.params.slug })
  .then((game) => {
    if (!game) {
      return Promise.reject(
        new Error('The selected game does not exist.')
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