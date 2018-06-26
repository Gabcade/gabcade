// blog.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Article = mongoose.model('Article');
const Comment = mongoose.model('Comment');

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

router.get('/:slug/edit', (req, res, next) => {
  var viewModel = { };
  if (!req.user || (!req.user.flags.isAdmin)) {
    return next(
      new Error('Must be logged in as administrator to edit blog articles.')
    );
  }
  Article
  .findOne({ slug: req.params.slug })
  .populate('author')
  .then((article) => {
    viewModel.article = article;
    res.render('blog/article-edit', viewModel);
  })
  .catch(next);
});

router.get('/:articleId/delete', (req, res, next) => {
  Article
  .remove({ _id: req.params.articleId })
  .then(( ) => {
    res.redirect('/blog');
  })
  .catch(next);
});

router.post('/:slug', (req, res, next) => {
  if (!req.user || !req.user.flags.isAdmin) {
    return next(new Error('Must be logged in as an administrator to edit blog articles.'));
  }
  Article
  .findOneAndUpdate(
    { slug: req.params.slug },
    {
      $set: {
        slug: req.body.slug,
        title: req.body.title,
        content: req.body.content
      }
    },
    { new: true }
  )
  .then(( ) => {
    res.redirect(`/blog/${req.params.slug}`);
  })
  .catch(next);
});

router.get('/:slug', (req, res, next) => {
  var viewModel = { };
  Article
  .findOne({ slug: req.params.slug.toLowerCase() })
  .populate('author')
  .then((article) => {
    viewModel.article = article;
    return Comment
    .find({ subject: article._id })
    .sort({ created: -1 })
    .limit(20)
    .populate('subject')
    .populate('author');
  })
  .then((comments) => {
    viewModel.comments = comments;
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
