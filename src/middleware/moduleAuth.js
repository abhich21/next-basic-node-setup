const modules = require("../modules")

const verifyModuleToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    })
  }

  const token = authHeader.split("Bearer ")[1]

  modules.auth.facade
    .verifySession(token)
    .then((sessionData) => {
      req.user = sessionData.user
      req.session = sessionData.session
      req.decoded = sessionData.decoded
      next()
    })
    .catch((error) => {
      res.status(401).json({
        success: false,
        message: "Invalid session",
        error: error.message,
      })
    })
}

const verifyFirebaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    })
  }

  const idToken = authHeader.split("Bearer ")[1]

  modules.auth.facade
    .verifyIdToken(idToken)
    .then((result) => {
      req.user = result.user
      req.decodedToken = result.decodedToken
      next()
    })
    .catch((error) => {
      res.status(401).json({
        success: false,
        message: "Invalid token",
        error: error.message,
      })
    })
}

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next()
  }

  const token = authHeader.split("Bearer ")[1]

  modules.auth.facade
    .verifySession(token)
    .then((sessionData) => {
      req.user = sessionData.user
      req.session = sessionData.session
      req.decoded = sessionData.decoded
      next()
    })
    .catch(() => {
      // Continue without authentication
      next()
    })
}

module.exports = {
  verifyModuleToken,
  verifyFirebaseToken,
  optionalAuth,
}
