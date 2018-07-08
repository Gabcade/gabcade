// game-achievement-grant.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GameAchievementGrantSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: true },
  game: { type: Schema.ObjectId, required: true, index: true, ref: 'Game' },
  user: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  achievement: { type: Schema.ObjectId, required: true, index: true, ref: 'GameAchievement' }
});

console.log('model: GameAchievement');
mongoose.model('GameAchievementGrant', GameAchievementGrantSchema);