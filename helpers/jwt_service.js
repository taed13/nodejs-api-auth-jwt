const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1m",
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }

      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized());
  }

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }

    req.payload = payload;
    next();
  });
};

const signRefreshToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId,
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };

    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }

      resolve(token);
    });
  });
};

const verifyRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          return reject(createError.Unauthorized());
        }

        resolve(payload);
      }
    );
  });
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
