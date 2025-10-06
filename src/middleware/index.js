const auth = require("./auth"),
  errorHandler = require("./errorHandler"),
  authenticate = require('./authenticate'),
  basicAuth =  require('./basicAuth')
  moduleAuth = require("./moduleAuth");

module.exports = {
  auth,
  errorHandler,
  moduleAuth,
  authenticate,
  basicAuth
};
