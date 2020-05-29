var express = require('express'),
    router  = express.Router();

var Campground  = require('../models/campground'),
    Comment     = require('../models/comment'),
    middleware  = require('../middleware'); //no need index as it will auto call index this is why we call index

// ==================
// Campground Routes
//===================
//INDEX Show all campgrounds
router.get("/", function(req,res){
    // get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        };
    });
});

// CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price:price, image: image, description: description, author: author};
    // create a new campground and save to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        };
    });
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the camp ground with the id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground);
            //render show template with the comanded campground
            res.render("campgrounds/show", {campground: foundCampground});
        };
    });
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        };
    });
});

// Update Campground Route
router.put("/:id", middleware.checkCampOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err){
            res.redirect("/campgrounds");
        } else {
            // redirect to the show page to see the changes
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

// Destroy Campground Route
router.delete("/:id", middleware.checkCampOwnership, function(req,res){
    Campground.findByIdAndDelete(req.params.id, function(err, campgroundRemoved){
        if(err){
            console.log(err)
        } else {
            Comment.deleteMany({_id: { $in: campgroundRemoved.comments } }, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/campgrounds");
                };
            });
        };
    });
});

// ==========
// Middleware
// ==========


module.exports = router;