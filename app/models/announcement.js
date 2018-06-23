// announcement.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, },
  game: { type: Schema.ObjectId, ref: 'Game' },
  title: { type: String, required: true },
  content: { type: String, required: true }
});

mongoose.model('Announcement', AnnouncementSchema);