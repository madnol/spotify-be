const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;

const UserModel = require("../users/schema");
const { authenticate } = require("./tools");

passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.CALLBACK_URL_SPOTIFY,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await UserModel.findOne({ email: profile._json.email });
        if (!user) {
          const newUser = {
            name: profile.displayName,
            imgUrl: profile.photos[0].value,
            favourites: [],
            email: profile._json.email,
          };
          const createdUser = new UserModel(newUser);
          await createdUser.save();
          const token = await authenticate(createdUser);
          done(null, { user: createdUser, token });
        } else {
          const tokens = await authenticate(user);
          done(null, { user, tokens });
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3001/users/googleRedirect",
    },
    async (request, accessToken, refreshToken, profile, next) => {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: profile.emails[0].value,
        role: "User",
        // refreshTokens: [],
      };

      //*CHECK IF GOOGLE USER EXISTS
      try {
        const user = await UserModel.findOne({ googleId: profile.id });
        console.log(user);
        //if google user exist, generate tokens

        if (user) {
          //check if exist
          const tokens = await authenticate(user);
          next(null, { user, tokens }); //first param is dedicated for error
        } else {
          //take tha newUser
          const createdUser = await UserModel(newUser);
          await createdUser.save();
          const tokens = await authenticate(createdUser);
          next(null, { user: createdUser, tokens });
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});
