// comment.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  article: { type: Schema.ObjectId, required: true, index: true, ref: 'Article' },
  author: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  sentiment: { type: String, enum: ['positive','neutral','negative'], default: 'neutral', index: true },
  content: { type: String }
});

mongoose.model('Comment', CommentSchema);