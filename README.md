Control your Raspberry PI GPIO via the Browser using NodeJS, Socket.IO and pi-gpio.

# Requirements #

Install the latest node.js on your Raspbian:

https://github.com/joyent/node/wiki/installing-node.js-via-package-manager


Install GPIO Admin, to allow users other than root to access the GPIO:

https://github.com/quick2wire/quick2wire-gpio-admin

# Install JSGPIOServer NodeJS Dependencies #

To install JSGPIOServer dependencies, issue:

npm install

# Configuration #

To configure the application change SocketIo.URL to point to your Raspberry PI IP address, found in index.html.

Optionally, change the listening port for the example server, by editing example-server.js

# Start server #

To start the example server, issue:

npm start

Or:

nodejs example-server.js

# Developer notes #

jsgpio-server.js - Provides a basic NodeJS module. See documentation for details.

jsgpio-client.js - Provides a basic client for the server.

example-server.js - Provides an example server.

index.html - Provides example usage.