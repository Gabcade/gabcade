// stripe.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// All Rights Reserved

'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const StripeWebhook = mongoose.model('StripeWebhook');
// const User = mongoose.model('User');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = (app) => {
  app.use('/stripe', router);
};

router.get('/charges/list', (req, res, next) => {
  if (!req.user || !req.user.flags.isAdmin) {
    return next(new Error('Must be logged in as an administrator.'));
  }
  const stripe = require('stripe')(req.user.stripe.accessToken);
  stripe.charges.list()
  .then((charges) => {
    res.status(200).json({ charges: charges });
  })
  .catch(next);
});

router.get('/get-started', (req, res, next) => {
  if (!req.user) {
    return next(new Error('You must be logged in to continue.'));
  }
  res.render('stripe/get-started');
});

router.get('/thank-you', (req, res, next) => {
  if (!req.user) {
    return next(new Error('You must be logged in to continue.'));
  }
  res.render('stripe/thank-you');
});

router.get('/subscribe', (req, res, next) => {
  if (!req.user) {
    return next(new Error('You must be logged in to continue.'));
  }
  res.render('stripe/subscribe');
});

router.post('/subscription/create', (req, res, next) => {
  var viewModel = { };
  stripe.customers
  .create({
    description: `Customer for ${req.user.email}`,
    source: req.body.ctoken
  })
  .then((customer) => {
    viewModel.customer = customer;
    req.user.stripe.customerId = customer.id;
    return stripe.subscriptions
    .create({
      customer: req.user.stripe.customerId,
      source: viewModel.customer.default_source,
      items: [{ plan: req.body.plan }]
    });
  })
  .then((subscription) => {
    viewModel.subscription = subscription;
    req.user.proSubscription = {
      isSubscribed: true,
      subscriptionId: viewModel.subscription.id,
      created: new Date(viewModel.subscription.created * 1000),
      customer: viewModel.subscription.customer,
      currentPeriodStart: new Date(viewModel.subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(viewModel.subscription.current_period_end * 1000),
      billing: viewModel.subscription.billing,
      billingCycleAnchor: new Date(viewModel.subscription.billing_cycle_anchor * 1000)
    };
    return req.user.save();
  })
  .then(( ) => {
    res.redirect(`/user/${req.user.username_lc}`);
  })
  .catch(next);
});

router.post('/webhook', (req, res) => {
  StripeWebhook
  .create({ data: req.body })
  .then(( ) => {
    res.status(200).end();
  })
  .catch((error) => {
    console.log('Stripe webhook error', error);
    res.status(500).json({ message: 'Internal server error' });
  });
});