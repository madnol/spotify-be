const express = require("express");
const listEndpoints = require("express-list-endpoints");
// const { join } = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
//*PASSPORT
const passport = require("passport");
const oauth = require("./services/auth/oauth");

//*ROUTER
const userRouter = require("./services/users");

const {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} = require("./errorHandling");

const server = express();
const port = process.env.PORT || 5001;
// const staticFolderPath = join(__dirname, "../public");

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

//MIDDLEWARES
server.use(cors());
server.use(express.json());
server.use(passport.initialize());
//ROUTES

server.use("/users", userRouter);

//ERROR HANDLERS
server.use(notFoundErrorHandler);
server.use(unauthorizedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(badRequestErrorHandler);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch(error => console.log(error))
  .then(
    server.listen(port, () =>
      console.log(`listen on port: http://localhost:${port}`)
    )
  )
  .catch(err => console.log(err));
