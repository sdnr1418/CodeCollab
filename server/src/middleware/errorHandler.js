// Every error in the API ends up here, so the client always gets the same shape:
// { "message": "...", "details": [...] }
import { ApiError } from "../utils/ApiError.js";
import { isProduction } from "../config/env.js";

export function notFound(req, res, next) {
  next(new ApiError(404, `Not found: ${req.method} ${req.originalUrl}`));
}

// Express knows this is the error handler because it has 4 parameters.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    message:
      status >= 500 && isProduction ? "Something went wrong" : err.message,
    ...(err.details && { details: err.details }),
  });
}
