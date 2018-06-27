// opus-service.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// All Rights Reserved

const crypto = require('crypto');

class OpusService {

  constructor (app, config) {
    this.app = app;
    this.config = config;
  }

  maskPassword (salt, password) {
    const hash = crypto.createHash('sha256');
    hash.update(this.config.passwordSalt);
    hash.update(salt);
    hash.update(password);
    return hash.digest('hex');
  }
}

module.exports = OpusService;