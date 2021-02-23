const jwt = require("jsonwebtoken");
const User = require("../users/schema");

const authenticate = async user => {
  try {
    const AccessToken = await generateJWT({ _id: user._id });
    // const newRefreshToken = await generateRefreshJWT({_id: user._id})
    // user.refreshTokens = user.refreshTokens.concat({token: nrefreshToken})
    await user.save();

    return { token: newAccessToken };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const generateJWT = payload =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyJWT = token =>
  new Promise((res, rej) =>
    //*From jsonwebtoken: it takes as parameter
    //*the token, the secret key and an anonymous function in case of error
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

module.exports = { authenticate, verifyJWT };
