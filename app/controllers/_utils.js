import JWT from "express-jwt";
import {errorObj, secret} from "../../config/settings";

export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}
const checkBlocked = (req, res, next) => {
  next();
};
export const JWTCheck = [JWT({secret}), checkBlocked];

export let taxObj = {
  gst: 5,
  serviceTax: 5
}

export default {}
