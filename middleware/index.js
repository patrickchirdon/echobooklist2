var Book = require("../models/book");
var User = require("../models/user");
var Comment  = require("../models/comment");
//all the middle ware goes here
var middlewareObj = {};

middlewareObj.checkBookOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Book.findById(req.params.id, function(err, foundBook){
                if(err || !foundBook){
                    req.flash("error","Book not found");
                    res.redirect("back");
                } else {
                      
                        //does user own the campground?
                        if(foundBook.postAuthor.id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        } else {
                            req.flash("error","you dont have permission to do that...");
                            res.redirect("back");
                        }
                }
        });
        } else {
            req.flash("error","You need to be logged in to do that...");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "comment not found");
                    res.redirect("back");
                } else {
                        //does user own the campground?
                        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        } else {
                            req.flash("error","you don't have permission to do that");
                            res.redirect("back");
                        }
                }
        });
        } else {
            res.redirect("back");
        }
}

middlewareObj.checkProfileOwnership = function(req, res, next){
        if(req.isAuthenticated()){
            User.findById(req.params.id, function(err, foundUser){
                if(err || !foundUser){
                    req.flash("error","User not found");
                    res.redirect("back");
                } else {
                      
                        //does user own the campground?
                        if(foundUser._id.equals(req.user._id) || req.user.isAdmin){
                            next();
                        } else {
                            req.flash("error","you dont have permission to do that...");
                            res.redirect("back");
                        }
                }
        });
        } else {
            req.flash("error","You need to be logged in to do that...");
            res.redirect("back");
        }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error","You need to be logged in to do that...");
    res.redirect("/login");
};

module.exports = middlewareObj;