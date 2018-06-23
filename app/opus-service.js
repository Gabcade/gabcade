// opus-service.js
// Copyright (C) 2018 theScoreX, Inc.
// All Rights Reserved

const crypto = require('crypto');

class ScorexService {

  constructor (app, config) {
    this.app = app;
    this.config = config;
  }

  maskPassword (salt, password) {
    const hash = crypto.createHash('sha256');
    console.log({ systemSalt: this.config.passwordSalt, userSalt: salt });
    hash.update(this.config.passwordSalt);
    hash.update(salt);
    hash.update(password);
    return hash.digest('hex');
  }
}

module.exports = ScorexService;