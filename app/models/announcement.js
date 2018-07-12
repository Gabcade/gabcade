// announcement.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  created: { type: Date, required: true, default: Date.now, },
  ownerType: {
    type: String,
    enum: [
      'Game',
      'GameDeveloper',
      'GameDevTeam',
      'GameDevStudio',
      'GameDevCompany'
    ],
    index: true
  },
  owner: { type: Schema.ObjectId, index: true, refPath: 'ownerType' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  flags: {
    isSticky: { type: Boolean, default: false, required: true, index: true }
  }
});

mongoose.model('Announcement', AnnouncementSchema);