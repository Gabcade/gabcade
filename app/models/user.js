// user.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  lastLogin: { type: Date, index: -1 },
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true },
  username_lc: { type: String, required: true, lowercase: true, index: true },
  passwordSalt: { type: String, required: true, select: false },
  password: { type: String, required: true, select: false },
  bio: { type: String },
  flags: {
    isAdmin: { type: Boolean, default: false, required: true },
    isGdprDismissed: { type: Boolean, default: false, required: true },
    canLogin: { type: Boolean, default: true, required: true, index: true },
    canPost: { type: Boolean, default: true, required: true, index: true },
    canComment: { type: Boolean, default: true, required: true, index: true }
  },
  stats: {
    gamesPlayed: { type: Number, default: 0, required: true }
  },
  images: {
    header: { type: Schema.ObjectId, ref: 'Image' },    // 1024 x 256
    profile: { type: Schema.ObjectId, ref: 'Image' },   //  256 x 256
    icon: { type: Schema.ObjectId, ref: 'Image' }       //   32 x  32
  },
  stripe: {
    customerId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    cardToken: { type: String }
  },
  proSubscription: {
    isSubscribed: { type: Boolean, default: false, required: true, index: true },
    subscriptionId: { type: String },
    created: { type: Date },
    customer: { type: String },
    subscription: { type: String },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    billing: { type: String },
    billingCycleAnchor: { type: Date }
  }
});

mongoose.model('User', UserSchema);