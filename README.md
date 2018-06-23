# gabcade.com User Manual

The whole gabcade.com website is being released as MIT open source for folks to review, learn from, and see how to integrate with the Gab.ai API once it becomes available and I can get my hands on it!

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