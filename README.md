# OpenPlatform.us User Manual for OPUS-2

OpenPlatform.us is the decentralized media platform for everyone! Licensed as MIT open source software

## Installation

### Node.js Runtime

The Node.js runtime is required to host the OpenPlatform.us application runtime as OPUS-2 

    cd /opt
      wget nodejs
      tar -xf nodejs

    vi /etc/profile
      PATH=$PATH:/opt/node/bin

### OpenPlatform.us Runtime

    git clone git@dev.openplatform.us:/opt/git/opus/site/openplatform.us
    npm install -g bower yarn gulp forever
    npm install

    vi ~/.bashrc
      export NODE_ENV="production"

    forever opus.js