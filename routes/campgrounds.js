// ========
// CAMPGROUND ROUTES
// ========

var express = require("express");
var router = express.Router();
var campGround = require("../models/campgrounds");
var middleware = require("../middleware");

// INDEX - GET all campgrounds
router.get("/", function(req, res){
    // get all campgrounds
    campGround.find({}, function(err, campGrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campGrounds: campGrounds});
        }
    });
});

// Create new Campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - Show more information about the campground
router.get("/:id", function(req, res){
    // Find Campground by ID
    campGround.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found");
            console.log(err);
            return res.redirect("back");
        }
        else{
            res.render("campgrounds/show", {campground: campground});
        }
    });
});

// Post new Campground to DB - after submitting form
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: name, price: price, image: image, description: description, user: user};
    campGround.create(newCamp, function(err, newCamp){
        if(err){
            console.log(err);
        }

        else{
            res.redirect("/campgrounds");
        }
    });
});


// Edit Campground Route
router.get("/:id/edit", middleware.checkUser, function(req, res){
    campGround.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground});
    });
});

// Update Campground Route 
router.put("/:id", middleware.checkUser, function(req, res){
    // find and update 
    campGround.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy campground Route
router.delete("/:id", middleware.checkUser, function(req, res){
    campGround.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campground");
        }
        req.flash("success", "Campground Deleted");
        res.redirect("/campgrounds");
    })
});

module.exports = router;