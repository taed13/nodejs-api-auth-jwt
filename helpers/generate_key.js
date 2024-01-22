const crypto = require("crypto");

const generateKey = () => {
  const access_token = crypto.randomBytes(32).toString("hex");
  const refresh_token = crypto.randomBytes(32).toString("hex");

  return {
    access_token,
    refresh_token,
  };
};

console.table(generateKey());

module.exports = generateKey;
