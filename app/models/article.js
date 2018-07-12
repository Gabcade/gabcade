// article.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, },
  author: { type: Schema.ObjectId, required: true, index: true, ref: 'User' },
  title: { type: String, required: true },
  slug: { type: String, required: true, index: true, lowercase: true, unique: true },
  content: { type: String, required: true },
  headerImage: { type: Schema.ObjectId, ref: 'Image' },
  icon: { type: Schema.ObjectId, ref: 'Image' }
});

mongoose.model('Article', ArticleSchema);