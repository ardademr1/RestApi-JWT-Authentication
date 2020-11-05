const passport = require("passport");

module.exports = function checkAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return res.redirect("/users/dashboard");
    }
    next();
  }