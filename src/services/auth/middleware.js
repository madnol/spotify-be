const jwt = require("jsonwebtoken");
const UserModel = require("../users/schema");
const { verifyJWT } = require("./tools");

const authorize = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");

    const decoded = await verifyJWT(token);

    const user = await UserModel.findOne({
      _id: decoded._id,
    });
    console.log(user);
    if (!user) {
      throw new Error();
    }
    /*
     *it not mandatory, I'm just creating new properties for a possible future use */
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    const err = new Error("Please authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const adminOnlyMiddleware = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    const err = new Error("Admins Only!");
    err.httpStatusCode = 403;
    next(err);
  }
};

module.exports = { authorize, adminOnlyMiddleware };
