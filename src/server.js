console.log("");
console.log(
  "//************************* Nodejs App **************************//"
);
console.log("");
//.env file
require("dotenv").config();

const config = require("./config");
const { initializeFirebase } = require("./config/firebase");

// Global flag to track if application has started
global.appStarted = false;

config.dbConfig(config.cfg, (error) => {
  if (error) {
    console.log(error, "Exiting the app.");
    return;
  }

  // Check if application has already started
  if (global.appStarted) {
    console.log("Application has already started. Skipping server initialization.");
    return;
  }

  // load external modules
  const express = require("express");
  var responseTime = require("response-time");
  const http = require("http");
  const { Server } = require("socket.io");

  // init express app
  const app = express();
  app.use(responseTime());
  //   app.use(compression());
  // set the view engine to ejs
  // Increase payload limit for URL-encoded bodies
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(express.json({ limit: '50mb' }));
  app.set("views", __dirname + "/views");
  app.set("view engine", "ejs");

  // set server home directory
  app.locals.rootDir = __dirname;
  global.approot = __dirname;

  // config express
  config.expressConfig(app, config.cfg);

  // attach the routes to the app
  require("./routes")(app);

   // Create an HTTP server instance
   const server = http.createServer(app);

     // Initialize Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"]
    }
  });

  // Setup WebSocket handling
  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    const userId = socket.handshake.query.userId;
    console.log("User id: ", userId);

    if (userId) {
      socket.join(userId);
      console.log(`Client ${socket.id} joined room ${userId}`);
    }

    socket.on('disconnect', () => {
        console.log(`Client ${socket.id} disconnected`);
        if (userId) {
            socket.leave(userId);
            console.log(`Client ${socket.id} left room ${userId}`);
        }
    });
  });

  initializeFirebase()
  // start server with error handling
  server.listen(config.cfg.port, () => {
    global.appStarted = true;
    console.log(
      `Express server listening on ${config.cfg.port}, in ${config.cfg.environment} mode`
    );
  }).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${config.cfg.port} is already in use. Application may already be running.`);
      console.log("If you want to start a new instance, please stop the existing one first.");
    } else {
      console.log("Server error:", error);
    }
  });
  
  module.exports = {io}
});
