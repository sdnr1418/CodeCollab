// Put after express-validator rules in a route. If any rule failed, answer 400
// with the first message (the client shows it in a toast) and the full list in details.
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const details = result
    .array()
    .map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, details[0].message, details));
}
