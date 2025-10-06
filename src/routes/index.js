const middleware = require("../middleware");
const user = require("../modules/user/route");
const auth = require("../modules/auth/route");
const todo = require("../modules/todos/route");
const responseHandler = require("../responseHandler");
//========================== Export Module Start ==========================
const routesWithAuth = [
  { path: "/api/v1/user", route: user },
  { path: "/api/v1/auth", route: auth },
  { path: "/api/v1/todo", route: todo },

];

// const routesWithoutAuth = [{ path: "/api/v2/authFree", route: AuthFreeRouter }];

//========================== Export Module Start ==========================
module.exports = function (app) {
  // Apply basic auth middleware to specific routes
  routesWithAuth.forEach(({ path, route }) => {
    app.use(path, middleware.basicAuth.basicAuthentication, route);
  });

  // routesWithoutAuth.forEach(({ path, route }) => {
  //   app.use(path, route);
  // });
  // Root route with plain HTML response
  app.get("/", (req, res) => {
    res.send(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Welcome</title>
          </head>
          <body>
              <h1>Welcome to GG TODO Backend</h1>
          </body>
          </html>
      `);
  });
  // if(config.isProd){
  //     app.use(middleware.crypt.decrypt(config))
  // }

  // Attach ErrorHandler to Handle All Errors
  app.use(responseHandler.defaultRoute);
  app.use(responseHandler.handleError);
};
//========================== Export Module End ============================
