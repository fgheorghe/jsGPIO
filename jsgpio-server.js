/**
 * Creates the Socket.IO server, and handles GPIO events. Should be used as a module. See example-server.js file.
 * @param {Object} config Configuration object. Requires the HttpServer.port property.
 * @constructor
 */
var JSGPIOServer = function (config) {
    // Store configuration for later use.
    this.config = config;

    // Create server.
    this.createServer();

    // Prepare GPIO handler.
    this.prepareGPIOHandler();
}

/**
 * Creates the HTTP server.
 * @function
 */
JSGPIOServer.prototype.createServer = function() {
    // Load ExpressJS.
    this.expressJSApp = require('express')();

    // Prepare an HTTP server.
    this.httpServer = require('http').Server(this.expressJSApp);

    // Load Socket.io
    this.socketIo = require('socket.io')(this.httpServer);

    // Start server.
    this.httpServer.listen(this.config.HttpServer.Port, function() {
        console.log("Server listening on port: " + this.config.HttpServer.Port);
    }.bind(this));

    // Bind request handlers for the index.html and jsgpio-client.js files.
    this.expressJSApp.get('/', function(request, response) {
        response.sendfile(__dirname + '/index.html');
    }.bind(this));
    this.expressJSApp.get('/jsgpio-client.js', function(request, response) {
        response.sendfile(__dirname + '/jsgpio-client.js');
    }.bind(this));

    // Bind incoming connection handler.
    this.socketIo.on('connection', this.socketIOConnectionHandler.bind(this));
}

/**
 * Prepares the GPIO helper: https://www.npmjs.com/package/pi-gpio.
 *
 * Instruction on how to install for the system user running this server: https://www.npmjs.com/package/pi-gpio
 *
 * @function
 */
JSGPIOServer.prototype.prepareGPIOHandler = function() {
    this.gpio = require("pi-gpio");
}

/**
 * Handles incoming socket connections. Binds event handlers.
 * @param {Object} socket
 */
JSGPIOServer.prototype.socketIOConnectionHandler = function (socket) {
    // Log incoming request.
    console.log("Incoming socket connection from: " + socket.handshake.address.address);

    // Bind event handlers.
    socket.on('write', this.writeEventHandler(socket).bind(this));
};

/**
 * Creates a pin write event handler.
 * @param socket {Object}
 * @returns {Function}
 */
JSGPIOServer.prototype.writeEventHandler = function (socket) {
    /**
     * Handles a pin write event, requested by the client.
     *
     * NOTE: The data.pin and data.value values _MUST_ be of data type number!
     *
     * @param {Object} data Requires the pin and value properties. See JSGPIOClient.prototype.write function definition.
     * @function
     */
    return function (data) {
        console.log("Write event data: ");
        console.log(data);

        try {
            // Write to pin, as per: https://www.npmjs.com/package/pi-gpio
            this.gpio.open(data.pin, "output", function(error) {
                if (error) {
                    this.emitErrEvent(socket, data, error.message);
                } else {
                    this.gpio.write(data.pin, data.value, function() {
                        this.gpio.close(data.pin, function() {
                            // Notify the client that we sent data.
                            this.emitWroteEvent(socket, data);
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));
        } catch (ex) {
            this.emitErrEvent(socket, data, ex.message);
        }
    }.bind(this);
}

/**
 * Emits a 'wrote' event to the client, indicating which pin data was sent to and the value.
 * @param socket {Object}
 * @param {Object} data As received by writeEventHandler.
 * @function
 */
JSGPIOServer.prototype.emitWroteEvent = function (socket, data) {
    socket.emit('wrote', data);
}

/**
 * Emits an err event to the client, including data and error message.
 * @param socket {Object}
 * @param {Object} data As received by writeEventHandler. A 'message' property will be added to this object.
 * @param {String} message
 * @function
 */
JSGPIOServer.prototype.emitErrEvent = function (socket, data, message) {
    data.message = message;
    console.log("Error: ");
    console.log(data);
    socket.emit('err', data);
}

// Export server class.
module.exports = JSGPIOServer;