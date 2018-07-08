// game-achievement.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GameAchievementSchema = new Schema({
  game: { type: Schema.ObjectId, required: true, index: true },
  icon: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true }
});

console.log('model: GameAchievement');
mongoose.model('GameAchievement', GameAchievementSchema);
