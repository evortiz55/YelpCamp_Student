var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');

// All the middleware goes here
var middlewareObj = {};

//  middle ware - checks that correct user is logged in and can manipulate posts
middlewareObj.checkCampOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Error 404 - Campground NOT Found")
                res.redirect("back");
            } else {
                // does user own campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You can add your own camp grounds but dont go editing others!")
                    res.redirect("back");
                };
            };
        });
    } else {
        res.redirect("back"); //sends user back to previous page
        };
};

// Check comment ownership middleware
middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Please Log In or Sign Up!")
                res.redirect("back");
            } else {
                // does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                };
            };
        });
    } else {
        res.redirect("back"); //sends user back to previous page
        };
};

// middle ware - prevent adding comment unless the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be LoggedIn or Sign Up!");
    res.redirect("/login");
};

module.exports = middlewareObj;