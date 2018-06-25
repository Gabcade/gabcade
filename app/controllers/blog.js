// blog.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

module.exports = (app) => {
  app.use('/blog', router);
};

router.use((req, res, next) => {
  res.locals.currentView = 'blog';
  next();
});

router.get('/compose', (req, res, next) => {
  if (!req.user || !req.user.flags.isAdmin) {
    return next(new Error('Must be logged in as an administrator to post blog articles.'));
  }
  res.render('blog/compose');
});

router.get('/:slug', (req, res, next) => {
  var viewModel = { };
  Article
  .findOne({ slug: req.params.slug.toLowerCase() })
  .populate('author')
  .then((article) => {
    viewModel.article = article;
    res.render('blog/article', viewModel);
  })
  .catch(next);
});

router.post('/', (req, res, next) => {
  if (!req.user || !req.user.flags.isAdmin) {
    return next(new Error('Must be logged in as an administrator to post blog articles.'));
  }
  Article
  .create({
    author: req.user._id,
    slug: req.body.slug,
    title: req.body.title,
    content: req.body.content
  })
  .then((article) => {
    res.redirect(`/blog/${article.slug}`);
  })
  .catch(next);
});

router.get('/', (req, res, next) => {
  var viewModel = { };
  Article
  .find()
  .sort({ created: -1 })
  .then((articles) => {
    viewModel.articles = articles;
    res.render('blog/index', viewModel);
  })
  .catch(next);
});
