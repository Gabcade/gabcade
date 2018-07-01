// gabcade-error.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

'use strict';

class GabcadeError extends Error {
  
  constructor (code, message) {
    super(message);
    this.code = code;
  }
}

module.exports = GabcadeError;