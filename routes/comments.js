var express = require('express'),
    router  = express.Router({mergeParams: true});
    
var Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware');

// ==============
// Comment Route
// ==============

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

// Create
router.post("/", middleware.isLoggedIn, function(req, res){
    // lookup using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            // create new comment
            // console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                     // link comment to campground
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to current campground show page 
                    res.redirect("/campgrounds/" + campground._id)
                };
            });
        };
    });
});

// Edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        };
    });
});

// Update Comments
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

// Delete comments (Destroy!!)
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    // find by ID and Remove
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

// ==========
// Middleware
// ==========


module.exports = router;