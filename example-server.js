// Load module.
var JSGPIOServer = require('./jsgpio-server.js');

// Create server...
new JSGPIOServer({
     HttpServer: {
         // Bind to port 8000.
         Port: 8000
     }
});