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
      name: 'openplatform-us-local',
      slogan: 'The decentralized media platform for local.'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/openplatform-us-local',
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
      name: 'openplatform-us-development',
      slogan: 'The decentralized media platform for developers.'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/openplatform-us-development',
    passwordSalt: '543bfc4e-a7ca-4365-87f2-233174053397',
    twitter: {
      consumer_key: 'M5c6BrBIJYomdiSSmdGm2dokF',
      consumer_secret: 'SSnQ54cslkKikpTnHF5N8Gc7sTXczwqKHNnwuyirXQcKNbKpK0',
      access_token_key: '894670938163335168-K1KWHI5V0CkFbIsYsEgYA9llQckSm9B',
      access_token_secret: 'lEJQUIz4O8YbSYmlR0AGaAxgI7tRLzNmSrvFFg8W7MFFq'
    },
    http: {
      enabled: true,
      redirectToHttps: false,
      healthMonitor: false,
      listen: {
        host: 'local.openplatform.us',
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
          domain: 'dev.openplatform.us'
        },
        store: null
      }
    },
    https: {
      enabled: false,
      cert: null,
      key: null,
      listen: {
        host: 'dev.openplatform.us',
        port: 3443
      },
      session: {
        name: 'opusSession.local',
        secret: 'fcb07483-c162-4187-9931-ae668e9f0b1e',
        resave: true,
        saveUninitialized: true,
        cookie: {
          domain: 'dev.openplatform.us',
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
      name: 'openplatform-us-test',
      slogan: 'The decentralized media platform for testers.'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/openplatform-us-test',
    passwordSalt: '16ea7e3d-5f02-4bad-9035-4d7746738337',
    twitter: {
      consumer_key: 'dUIgUhBLAlQ0xL86CWar7cC0t',
      consumer_secret: 'mO50IvISDAmXUCzSGxa4BFl5GCCRzjS39Mld4GVKwzffetFRKk',
      access_token_key: '894670938163335168-wPHIS8ccBaqadP48RmPSgr9vykB0jlP',
      access_token_secret: 'z3X8xapeY6qMP79prLWuA7CoeKajeyLi1N4wqINWwdZa9'
    },
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
          domain: 'test.openplatform.us',
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
          domain: 'test.openplatform.us',
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
      name: 'openplatform-us',
      slogan: 'The decentralized media platform for everyone.'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/openplatform-us-production',
    passwordSalt: '18055dcf-d44f-45b2-8d74-ad38f6e4da89',
    twitter: {
      consumer_key: 'dUIgUhBLAlQ0xL86CWar7cC0t',
      consumer_secret: 'mO50IvISDAmXUCzSGxa4BFl5GCCRzjS39Mld4GVKwzffetFRKk',
      access_token_key: '894670938163335168-wPHIS8ccBaqadP48RmPSgr9vykB0jlP',
      access_token_secret: 'z3X8xapeY6qMP79prLWuA7CoeKajeyLi1N4wqINWwdZa9'
    },
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
          domain: 'openplatform.us',
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
          domain: 'openplatform.us',
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
