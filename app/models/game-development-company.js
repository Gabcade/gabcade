// game-development-company.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameDevCompanySchema = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true, index: true },
});

GameDevCompanySchema.index({
  name: 'text',
  bio: 'text'
}, {
  weights: {
    name: 10,
    bio: 1
  }
});

mongoose.model('GameDevCompany', GameDevCompanySchema);