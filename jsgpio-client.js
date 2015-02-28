/**
 * Creates a Socket.IO and handles GPIO events.
 * @param config {Object} Configuration object. Requires SocketIo.URL, GPIO.wroteEventHandler and GPIO.errEventHandler properties.
 * @constructor
 */
JSGPIOClient = function(config) {
    this.config = config;

    this.init();
}

/**
 * Creates the Socket.IO client.
 * @function
 */
JSGPIOClient.prototype.init = function () {
    // Create socket io client.
    this.socketIo = io.connect(this.config.SocketIo.URL);

    // Bind 'wrote' event handler.
    this.socketIo.on('wrote', function(data) { this.config.GPIO.wroteEventHandler(data);}.bind(this));
    // Bind 'error' event handler.
    this.socketIo.on('err', function(data) { this.config.GPIO.errEventHandler(data);}.bind(this));
}

/**
 * Writes to pin.
 * @param pin {Number} Pin number.
 * @param value {Number} Value to write: 0 - low, 1 - high.
 * @function
 */
JSGPIOClient.prototype.write = function (pin, value) {
    this.socketIo.emit('write', { pin: pin, value: value });
}