// stripe-webhook.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StripeWebhookSchema = new Schema({
  created: { type: Date, default: Date.now, required: true, index: -1 },
  type: { type: String, required: true, index: true },
  data: { type: Schema.Types.Mixed }
});

console.log('model: User');
mongoose.model('StripeWebhook', StripeWebhookSchema);