const { responseStandard } = require("../helpers/response");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
      return responseStandard(res, "No token provided", {}, 400, false);
    }
    const verify = jwt.verify(token, SECRET_KEY);
    if (!verify) {
      return responseStandard(res, "Unauthorized access", {}, 403, false);
    }
    req.user = verify;
    return next();
  } catch (error) {
    return responseStandard(res, error.message, {}, 500, false);
  }
};

module.exports = { authentication };