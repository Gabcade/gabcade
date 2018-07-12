// game-development-team.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameDevTeamSchema = new Schema({
  studio: { type: Schema.ObjectId, index: true, ref: 'GameDevCompany' },
  name: { type: String, required: true },
  bio: { type: String }
});

GameDevTeamSchema.index({
  name: 'text',
  bio: 'text'
}, {
  weights: {
    name: 10,
    bio: 1
  }
});

mongoose.model('GameDevTeam', GameDevTeamSchema);