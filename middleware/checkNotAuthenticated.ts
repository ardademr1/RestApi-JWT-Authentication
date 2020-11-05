export {};

module.exports = function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({message: "Yetkisiz Giriş"});
}