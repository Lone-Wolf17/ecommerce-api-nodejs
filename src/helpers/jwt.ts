// const expressJwt = require("express-jwt");
import expressJwt from 'express-jwt';
import { CustomRequestObject } from '../models/custom-request-object';

const secrett = process.env.JWT_SECRET!;
const apiBaseUrl = process.env.API_BASE_URL!;

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

async function isRevoked(req : CustomRequestObject, payload: any, done: any) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

export default authJwt;
