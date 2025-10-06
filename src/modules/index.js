const authModule = {
  routes: require("./auth/route"),
  facade: require("./auth/facade"),
  validators: require("./auth/validators"),
}

const userModule = {
  routes: require("./user/route"),
  facade: require("./user/facade"),
  service: require("./user/service"),
  validators: require("./user/validators"),
}


module.exports = {
  auth: authModule,
  user: userModule,
}
