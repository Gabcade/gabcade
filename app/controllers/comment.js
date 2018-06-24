// comment.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = mongoose.model('Comment'); // jshint ignore:line

module.exports = (app) => {
  app.use('/comment', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'comment';
  next();
});

router.post('/', (req, res, next) => {
  if (!req.user) {
    return next(new Error('Players must be logged in to comment.'));
  }
  Comment
  .create({
    subjectType: req.body.subjectType,
    subject: req.body.subject,
    author: req.user._id,
    sentiment: req.body.sentiment,
    content: req.body.content
  })
  .then((comment) => {
    switch (comment.subjectType) {
      case 'Game':
        return res.redirect(`/game/${comment.subject}/discuss`);
      case 'User':
        return res.redirect(`/user/${comment.subject}/discuss`);
    }
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Comment
  .find()
  .sort({ created: -1 })
  .limit(25)
  .populate('subject')
  .then((comments) => {
    viewModel.comments = comments;
    res.render('index', viewModel);
  })
  .catch(next);
});
