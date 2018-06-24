// image.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  ownerType: { type: String, required: true, index: true },
  owner: { type: Schema.ObjectId, required: true, index: true, refPath: 'ownerType' },
  type: { type: String },
  mimetype: { type: String },
  size: { type: Number },
  data: { type: Buffer, select: false }
});

console.log('model: Image');
mongoose.model('Image', ImageSchema);