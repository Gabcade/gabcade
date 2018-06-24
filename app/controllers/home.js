// home.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
  res.render('index');
});
