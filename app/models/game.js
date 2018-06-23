// game.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, index: -1 },
  updated: { type: Date, index: -1 },
  slug: { type: String, required: true, index: true, lowercase: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  stats: {
    plays: { type: Number, default: 0 }
  }
});

mongoose.model('Game', GameSchema);