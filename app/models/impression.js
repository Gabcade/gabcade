// impression.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImpressionSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  subjectType: { type: String, required: true, index: true },
  subject: { type: Schema.ObjectId, required: true, index: true, refPath: 'subjectType' },
  user: { type: Schema.ObjectId, index: true, sparse: true, ref: 'User' }
});

console.log('model: Impression');
mongoose.model('Impression', ImpressionSchema);