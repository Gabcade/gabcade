// admin.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Game = mongoose.model('Game');

module.exports = (app) => {
  app.use('/admin', router);
};

router.post('/game', (req, res, next) => {
  var viewModel = { };
  Game.create({
    slug: req.body.slug,
    title: req.body.title,
    description: req.body.description
  })
  .then((game) => {
    viewModel.game = game;
    viewModel.slug = 'nucleoid';
    res.render('game/created', viewModel);
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Game
  .find()
  .limit(10)
  .then((games) => {
    viewModel.games = games;
    res.render('admin/index', viewModel);
  })
  .catch(next);
});
