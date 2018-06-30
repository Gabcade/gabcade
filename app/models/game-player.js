// game-player.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamePlayerSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, },
  game: { type: Schema.ObjectId, required: true, index: true, ref: 'GabcadeApiApp' },
  user: { type: Schema.ObjectId, required: true, index: true, ref: 'User' }
});

console.log('model: GamePlayer');
mongoose.model('GamePlayer', GamePlayerSchema);