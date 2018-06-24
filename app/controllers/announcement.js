// announcement.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Game = mongoose.model('Game');
const Announcement = mongoose.model('Announcement');

module.exports = (app) => {
  app.use('/announce', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'announce';
  next();
});

router.post('/', (req, res, next) => {
  var announcement = {
    title: req.body.title,
    content: req.body.content
  };
  if (req.body.gameId && req.body.gameId.length) {
    announcement.game = req.body.gameId;
  }
  Announcement
  .create(announcement)
  .then(( ) => {
    res.redirect('/announcements');
  })
  .catch(next);
});

router.get('/:gameId', (req, res, next) => {
  var viewModel = { };
  Game
  .findById(req.params.gameId)
  .then((game) => {
    viewModel.game = game;
    return Announcement.find({ game: req.params.gameId });
  })
  .then((announcements) => {
    viewModel.announcements = announcements;
    res.render('announcement/game', viewModel);
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Announcement
  .find()
  .sort({ created: -1 })
  .limit(10)
  .populate('game')
  .then((announcements) => {
    viewModel.announcements = announcements;
    res.render('announcement/index', viewModel);
  })
  .catch(next);
});
