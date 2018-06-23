// user.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true },
  username_lc: { type: String, required: true, lowercase: true, index: true },
  passwordSalt: { type: String, required: true, select: false },
  password: { type: String, required: true, select: false },
  flags: {
    isAdmin: { type: Boolean, default: false, required: true },
    canLogin: { type: Boolean, default: true, required: true, index: true },
    canPost: { type: Boolean, default: true, required: true, index: true },
    canComment: { type: Boolean, default: true, required: true, index: true }
  }
});

mongoose.model('User', UserSchema);