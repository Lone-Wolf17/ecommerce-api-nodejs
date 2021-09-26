const expressJwt = require("express-jwt");
const secrett = process.env.JWT_SECRET;

const apiBaseUrl = process.env.API_BASE_URL;

const authJwt = expressJwt({
  secret: secrett,
  algorithms: ["HS256"],
  isRevoked: isRevoked,
}).unless({
  path: [
    { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
    { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
    `${apiBaseUrl}/users/login`,
    `${apiBaseUrl}/users/register`,
  ],
});

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt;
