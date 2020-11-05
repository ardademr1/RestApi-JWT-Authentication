module.exports.index = function(req,res){
    res.render("index.ejs");
}
/*module.exports.dashboard = function(req,res){
    console.log(req.isAuthenticated());
    res.render("dashboard", { user: req.user.name });
}*/