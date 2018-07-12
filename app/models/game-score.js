// game-score.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameScoreSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  finished: { type: Date, default: Date.now, required: true, index: -1 },
  game: { type: Schema.ObjectId, required: true, index: true, ref: 'Game' },
  user: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  score: { type: Number, required: true, index: -1 },
  note: { type: String },
  minutesPlayed: { type: Number }
});

/*
 * For game-wide leaderboards
 */
GameScoreSchema.index({
  game: 1,
  score: -1
}, {
  name: 'game_score_idx'
});

/*
 * For viewing one player's results within a game
 */
GameScoreSchema.index({
  game: 1,
  user: 1,
  score: -1
}, {
  name: 'game_user_score_idx'
});

mongoose.model('GameScore', GameScoreSchema);