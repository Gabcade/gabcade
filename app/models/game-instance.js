// game-instance.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: true, expires: '1d' },
  game: { type: Schema.ObjectId, required: true, index: true, ref: 'Game' },
  user: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  state: {
    type: String,
    enum: ['pending', 'finished', 'aborted'],
    default: 'pending',
    required: true,
    index: true
  },
  startParams: { type: String },
  note: { type: String },
  score: { type: Number, sparse: true, index: true }
});

GameInstanceSchema.index({
  state: 1,
  user: 1
}, {
  name: 'gameinstance_state_user_idx'
});

console.log('model: GameInstance');
mongoose.model('GameInstance', GameInstanceSchema);