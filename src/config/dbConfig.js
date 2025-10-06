"use strict"

//=================================== Load Modules start ===================================

//=================================== Load external modules=================================
const mongoose = require('mongoose');

//=================================== Load Modules end =====================================

// Connect to Db
function connectDb(env, callback) {
    let dbUrl = env.mongo.dbUrl(env.mongo.userName, env.mongo.Pass, env.mongo.dbName);
    let dbOptions = env.mongo.options;
    if (env.isProd) {
        console.log("Configuring db in " + env.TAG + ' mode');
    } else {
        console.log("Configuring db in " + env.TAG + ' mode');
        mongoose.set('debug', true);
    }
    if(process.env.NODE_ENV==='remote'){
    dbUrl=`mongodb://localhost:27017/${env.mongo.dbName}`;
    }
    console.log("Connecting to database", dbUrl);
    mongoose.connect(dbUrl, dbOptions);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Connected to DB');
        callback();
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (error) {
        console.log('DB connection error: ' + error);
        callback(error);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('DB connection disconnected.');
        callback("DB connection disconnected.");
    });
}

// ========================== Export Module Start ==========================
module.exports = connectDb;
// ========================== Export Module End ============================