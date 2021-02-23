const notFoundErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 404) {
    res.status(404).send(err.message || "Error! Not Found!");
  }
  next(err);
};

const unauthorizedErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 401) {
    console.log(err);
    res.status(401).send("Error! Not Authorized!");
  }
  next(err);
};

const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 403) {
    res.status(403).send("Error! Forbidden!");
  }
  next(err);
};

const badRequestErrorHandler = (err, req, res, next) => {
  if (err.httpStatusCode === 400) {
    res.status(400).send("Error! Bad Request!");
  }
  next(err);
};

const catchAllErrorHandler = (err, req, res, next) => {
  if (!res.headersSent) {
    console.log(err);
    res.status(500).send("Generic Server Error!");
  }
};

module.exports = {
  notFoundErrorHandler,
  unauthorizedErrorHandler,
  forbiddenErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
};
