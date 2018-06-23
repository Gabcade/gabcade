// config.js
// Copyright (C) 2018 Rob Colbert <rob.colbert@openplatform.us>
// License: MIT

const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  local: {
    root: rootPath,
    app: {
      name: 'gabcade-local',
      slogan: 'Fun With Freedom #PlayFreely'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/gabcade-local',
    redis: {
      "host": "0.0.0.0",
      "port": 6379/*,
      "password": "27f31fe0-69f9-4abd-b809-7712ef0d67bc"*/
    },
    passwordSalt: 'de2af432-8c73-4461-ae58-168ef3a6abac',
    http: {
      enabled: true,
      redirectToHttps: false,
      healthMonitor: false,
      listen: {
        host: '0.0.0.0',
        port: 3000
      },
      session: {
        name: 'opusSession.local',
        secret: 'd6214dd0-124a-424f-8e01-6b1714e879ad',
        resave: true,
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 604800000
        },
        store: null
      }
    },
    https: {
      enabled: false,
      cert: null,
      key: null,
      listen: {
        host: '0.0.0.0',
        port: 3443
      },
      session: {
        name: 'opusSession.local',
        secret: 'f017fb9b-633b-4186-878c-583a9b8b51ee',
        resave: true,
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 604800000
        },
        store: null
      }
    }
  },

  development: {
    root: rootPath,
    app: {
      name: 'gabcade-development',
      slogan: 'Fun With Freedom #PlayFreely'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/gabcade-development',
    redis: {
      "host": "0.0.0.0",
      "port": 6379/*,
      "password": "27f31fe0-69f9-4abd-b809-7712ef0d67bc"*/
    },
    passwordSalt: '543bfc4e-a7ca-4365-87f2-233174053397',
    http: {
      enabled: true,
      redirectToHttps: false,
      healthMonitor: false,
      listen: {
        host: '0.0.0.0',
        port: 3000
      },
      session: {
        name: 'opusSession.development',
        secret: 'c1f565c8-f760-491d-b3eb-12401af5e69a',
        resave: true,
        saveUninitialized: true,
        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 604800000,
          domain: 'dev.gabcade.com'
        },
        store: null
      }
    },
    https: {
      enabled: false,
      cert: null,
      key: null,
      listen: {
        host: '0.0.0.0',
        port: 3443
      },
      session: {
        name: 'opusSession.local',
        secret: 'fcb07483-c162-4187-9931-ae668e9f0b1e',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'dev.gabcade.com',
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 604800000
        },
        store: null
      }
    }
  },

  test: {
    root: rootPath,
    app: {
      name: 'gabcade-test',
      slogan: 'Fun With Freedom #PlayFreely'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/gabcade-test',
    redis: {
      "host": "0.0.0.0",
      "port": 6379/*,
      "password": "27f31fe0-69f9-4abd-b809-7712ef0d67bc"*/
    },
    passwordSalt: '16ea7e3d-5f02-4bad-9035-4d7746738337',
    http: {
      enabled: true,
      redirectToHttps: false,
      healthMonitor: true,
      listen: {
        host: '0.0.0.0',
        port: 3000
      },
      session: {
        name: 'opusSession.test',
        secret: '5e989f66-a904-45e8-8f08-fd4367ac0bd7',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'test.gabcade.com',
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 604800000
        },
        store: null
      }
    },
    https: {
      enabled: true,
      cert: '/opt/site/keys/fullchain.pem',
      key: '/opt/site/keys/privkey.pem',
      listen: {
        host: '0.0.0.0',
        port: 3443
      },
      session: {
        name: 'opusSession.test',
        secret: 'e5d3daa5-859b-46fb-bf59-67225442eb94',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'test.gabcade.com',
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 604800000
        },
        store: null
      }
    }
  },

  production: {
    root: rootPath,
    app: {
      name: 'gabcade',
      slogan: 'Fun With Freedom #PlayFreely'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/gabcade-production',
    redis: {
      "host": "0.0.0.0",
      "port": 6379/*,
      "password": "27f31fe0-69f9-4abd-b809-7712ef0d67bc"*/
    },
    passwordSalt: '18055dcf-d44f-45b2-8d74-ad38f6e4da89',
    http: {
      enabled: true,
      redirectToHttps: false,
      healthMonitor: true,
      listen: {
        host: '0.0.0.0',
        port: 3000
      },
      session: {
        name: 'opusSession',
        secret: 'c559e175-0915-4186-9d49-bd854a8d68a2',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'gabcade.com',
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: 604800000
        },
        store: null
      }
    },
    https: {
      enabled: true,
      cert: '/opt/site/keys/fullchain.pem',
      key: '/opt/site/keys/privkey.pem',
      listen: {
        host: '0.0.0.0',
        port: 3443
      },
      session: {
        name: 'opusSession',
        secret: '4c8cc6e3-c02a-42af-9fff-1d7efdb668e6',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'gabcade.com',
          path: '/',
          httpOnly: true,
          secure: true,
          maxAge: 604800000
        },
        store: null
      }
    }
  }
};

module.exports = config[env];
