var express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

// Landing Page
router.get("/", function(req,res){
    res.render("landing");
});

// ============
// AUTH ROUTES
// ============

// Show the register form
router.get("/register", function(req, res){
    res.render("register")
});

// Sing Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){

            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show LogIn Form
router.get("/login", function(req, res){
    res.render("login");
});

// LogIn Logic
router.post("/login", passport.authenticate("local",
     {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// LogOut Logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You have Logged Out!");
    res.redirect("/campgrounds");
});

module.exports = router;