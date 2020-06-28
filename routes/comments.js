// ========
// COMMENTS ROUTES
// ========

var express = require("express");
var router = express.Router({mergeParams: true});
var campGround = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    campGround.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

// Comments Create 
router.post("/", middleware.isLoggedIn, function(req, res){
    campGround.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else{
                    // add username and id to comments 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully created comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentUser, function(req, res){
    campGround.findById(req.params.id, function(err, campground){
        // check if campground exists
        if(err || !campground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        // if campground exits, let user edit comment
        else {
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit", {campground_id: req.params.id, comment: comment});
                }
            });
        }
    });
});

// Update Route
router.put("/:comment_id", middleware.checkCommentUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete Comment
router.delete("/:comment_id/", middleware.checkCommentUser, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;