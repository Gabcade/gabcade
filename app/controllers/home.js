// home.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'home';
  next();
});

router.get('/privacy', (req, res) => {
  res.render('privacy');
});

router.get('/', (req, res, next) => {
  Article
  .find()
  .then((articles) => {
    res.render('index', {
      title: 'Generator-Express MVC',
      articles: articles
    });
  })
  .catch(next);
});
