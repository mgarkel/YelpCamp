// All Middleware goes here 
var campGround = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = {};

// Check campground ownership
middlewareObj.checkUser = function(req, res, next){
    // Check if user is logged in
    if(req.isAuthenticated()){
        campGround.findById(req.params.id, function(err, campground){
            if(err || !campground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else{
                // does the user own this campground
                if(campground.user.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do this");
                    res.redirect("back");
                }
            }
        });
    }

    // if not logged in, go back
    else{
        req.flash("error", "You need to be logged in to do this");
        res.redirect("back");
    }
}

// Check comment user
middlewareObj.checkCommentUser = function(req, res, next){
    // Check if user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else{
                // does the user own this comment
                if(comment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You don't have permission to do this");
                    res.redirect("back");
                }
            }
        });
    }
    // if not logged in, go back
    else{
        req.flash("error", "You need to be logged in to do this");
        res.redirect("back");
    }
}

// Check if user is logged in 
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do this");
    res.redirect("/login");
}

module.exports = middlewareObj;