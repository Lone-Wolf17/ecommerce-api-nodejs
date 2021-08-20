
const expressJwt = require("express-jwt");
const secrett = process.env.JWT_SECRET;

const authJwt = expressJwt({
  secret: secrett,
  algorithms: ["HS256"]
});
module.exports = authJwt;
