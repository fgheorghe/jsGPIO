// Load module.
var JSGPIOServer = require('./jsgpio-server.js');

// Create server...
var ExampleServer = new JSGPIOServer({
     HttpServer: {
         // Bind to port 8000.
         Port: 8000
     }
});

// Release all pins on process end.
process.on('SIGINT', ExampleServer.cleanUpAndTerminateProcess);