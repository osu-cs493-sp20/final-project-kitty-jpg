const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const secretKey = 'SuperSecret123';

exports.generateAuthToken = function (userId, role) {
  const payload = { sub: userId, role: role};
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};

/* 
 * Use on endpoints that require JWT auth
 * populates the request field id with JWT subject value
 * populates the request field role with JWT role value
 */ 
exports.requireAuthentication = function (req, res, next) {
  if (req.user.id && req.user.role){
    next();
  }else {
    res.status(401).send({
      error: "Invalid authentication token"
    });
  }
  /*
   * Authorization: Bearer <token>
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ?
    authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    console.error("  -- error:", err);
    res.status(401).send({
      error: "Invalid authentication token"
    });
  }
   */
};

/* 
 * Can be used as global middleware to parse JWT data for
 * all requests. Does not interfere with a request's route
 */ 
exports.optionalAuthentication = function (req, _, next) {
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ?
    authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = { id: new ObjectId(payload.sub), role: payload.role };
    next();
  } catch (err) {
    req.user = {} // prevent id & role spoofing
    console.log("  -- No valid token detected");
    next();
  }
};

// use this middleware to compare JWT derived fields to a URL parameter field
// if a user is admin (role 0), bypass the check
exports.requireAuthorizationURL = function(req, res, next, fieldName){
  if (req.user.id === new ObjectId(req.params[fieldName]) || req.user.role === 0){
    next()
  }
  else {
    res.status(401).send({
      error: "User is not authorized to perform this action"
    });
  }
}

// use this middleware to compare JWT derived fields to a body field
// if a user is admin (role 0), bypass the check
exports.requireAuthorizationBody = function(req, res, next, fieldName){
  if (req.user.id === new ObjectId(req.body[fieldName]) || req.user.role === 0){
    next()
  }
  else {
    res.status(401).send({
      error: "User is not authorized to perform this action"
    });
  }
}