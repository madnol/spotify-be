const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: String,
    surname: String,
    email: String,
    imgUrl: String,
    password: String,
    googleId: String,
    spotify: String,
    // refreshTokens: [{ token: String }],
  },

  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UserSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;
    else return { error: "Username/password incorrect" };
  } else return null;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPW = user.password;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

const userModel = model("user", UserSchema);

module.exports = userModel;
