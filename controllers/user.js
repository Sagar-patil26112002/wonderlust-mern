const User = require("../models/user.js");

module.exports.renderSignup = (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupUser = async(req, res)=>{
    try{
        let {username,email, password} = req.body;
        const newuser = new User({email, username});
        let registerUser = await User.register(newuser, password);
        req.login(registerUser, (err, next)=>{
            if(err){
                return next(err);
            }
            req.flash("success", `welcome to WonderLust! ${req.user.username}`);
            res.redirect("/Listings");
        });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLogin = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser =async(req, res)=>{
    req.flash("success",`Welcome to WenderLust ${req.user.username}.`);
    let redirectUrl = res.locals.redirectUrl || "/Listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.redirect('/'); // Redirect to home or error page
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.redirect('/Listings'); // Redirect to listings page
        });
    })
};