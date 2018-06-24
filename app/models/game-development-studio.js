// game-development-studio.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameDevStudioSchema = new Schema({
  company: { type: Schema.ObjectId, required: true, ref: 'GameDevCompany' },
  name: { type: String, required: true },
  bio: { type: String }
});

GameDevStudioSchema.index({
  name: 'text',
  bio: 'text'
}, {
  weights: {
    name: 10,
    bio: 1
  },
  name: 'game_studio_text_search'
});

console.log('model: GameDevStudio');
mongoose.model('GameDevStudio', GameDevStudioSchema);