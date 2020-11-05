

module.exports.login_get = (req,res)=>{
    // passport error mesajı üretir.
    console.log(req.session.flash.error);
    res.render("login.ejs");
}
module.exports.login_post = (req,res)=>{
    
}