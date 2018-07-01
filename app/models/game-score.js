// game-score.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameScoreSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  game: { type: Schema.ObjectId, required: true, index: true, ref: 'Game' },
  user: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  score: { type: Number, required: true, index: -1 }
});

GameScoreSchema.index({
  game: 1,
  user: 1,
  score: -1
}, {
  name: 'game_user_score_idx'
});

GameScoreSchema.index({
  game: 1,
  score: -1
}, {
  name: 'game_score_idx'
});

console.log('model: GameScore');
mongoose.model('GameScore', GameScoreSchema);