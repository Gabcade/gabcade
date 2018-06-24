# gabcade.com User Manual

The whole gabcade.com website is being released as MIT open source for folks to review, learn from, and see how to integrate with the Gab.ai API once it becomes available and I can get my hands on it!

## DigitalOcean Droplet Configuration

Spin up a new droplet. Then, ssh to it and run this command as the root user to install the bare minimum required dependencies.

    apt-get install python gcc g++ make mongodb redis-server

python, gcc, g++ and make are required for geoip2 integration to be able to build its C++ Node.js plugin.

mongodb and redis-server are required for database functionality.

## Node.js Runtime Setup

    cd /opt
    wget https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-x64.tar.xz
    tar -xf https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-x64.tar.xz
    ln -s https://nodejs.org/dist/v8.11.3/node-v8.11.3-linux-x64 node

    vi /etc/profile
        [at end of file]
        PATH=$PATH:/opt/node/bin
        export PATH

Now, as the root user, please make sure Node.js can start:

    node

As the root user, please install the global Node.js management requirements:

    npm install -g yarn bower gulp forever 

## Github Repository Setup

As root:

    adduser gabcade

As gabcade:

    su - gabcade
    ssh-keygen
    [add ~/.ssh/id_rsa.pub to github]

As root:

    cd /opt
    mkdir site
    chown -R gabcade:gabcade site

As gabcade:

    vi ~/.bashrc
      export NODE_ENV="production"

    cd /opt/site
      git clone git@github.com:robcolbert/gabcade.git
      yarn

    forever gabcade.js

Congratulations! It's a server. And, it's running on port 3000.