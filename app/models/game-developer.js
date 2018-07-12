// game-developer.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameDeveloperSchema = new Schema({
  team: { type: Schema.ObjectId, ref: 'GameDevTeam' },
  name: { type: String, required: true },
  title: { type: String, required: true },
  creditAs: { type: String, required: true },
  bio: { type: String }
});

GameDeveloperSchema.index({
  name: 'text',
  title: 'text',
  creditAs: 'text',
  bio: 'text'
}, {
  weights: {
    name: 10,
    title: 8,
    creditAs: 5,
    bio: 1
  },
  name: 'game_dev_text_search'
});

mongoose.model('GameDeveloper', GameDeveloperSchema);