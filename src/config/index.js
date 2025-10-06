const dbConfig = require("./dbConfig");
const expressConfig = require("./expressConfig");
// const sequelize =require("./sequelizeInstace")
var envConfig = {};
var cfg = {};
var environment = process.env.NODE_ENV || 'local'; //If no env given then by default local env is chosen
// var environment = 'remoteServer';
//ENV Config
switch (environment) {
    case 'dev':
    case 'development':
        envConfig = require('./env/development');
        break;
    case 'prod':
    case 'production':
        envConfig = require('./env/production');
        break;
    case 'preprod':
        envConfig = require('./env/preprod.js');
        break;
    case 'stag':
    case 'staging':
        envConfig = require('./env/staging');
        break;
    case 'local':
        envConfig = require('./env/local');
        break;

}
var defaultConfig = require('./default.js');
//Create Final Config JSON by extending env from default
// cfg = { ...defaultConfig, ...envConfig,sequelize }
cfg = { ...defaultConfig, ...envConfig }


//Export config module
module.exports = {
    cfg,
    dbConfig,
    expressConfig
}