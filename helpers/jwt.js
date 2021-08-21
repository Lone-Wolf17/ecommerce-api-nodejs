const expressJwt = require("express-jwt");
const secrett = process.env.JWT_SECRET;

const apiBaseUrl = process.env.API_BASE_URL;

const authJwt = expressJwt({
  secret: secrett,
  algorithms: ["HS256"],
}).unless({
  path: [
    { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
    `${apiBaseUrl}/users/login`,
    `${apiBaseUrl}/users/register`,
  ],
});
module.exports = authJwt;
