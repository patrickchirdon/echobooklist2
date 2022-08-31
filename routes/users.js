var express    = require("express");
var router     = express.Router();
var middleware = require("../middleware");
var Book = require("../models/book");
var User       = require("../models/user");

//User profile routes
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", "user not found");
      res.redirect("/books");
    }
    Book.find().where("postAuthor.id").equals(foundUser._id).exec(function(err, foundBooks){
      if(err){
        req.flash("error", "Something went wrong!");
        res.redirect("/books");
      }
      res.render("users/show", {user: foundUser, books: foundBooks});
    });
  });
});

//Edit user profile
router.get("/users/:id/edit",middleware.isLoggedIn, middleware.checkProfileOwnership,  function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      console.log(err);
    } 
    res.render("users/edit", {user: foundUser});     
  });
});

//update user profile route
router.put("/users/:id",middleware.checkProfileOwnership,  function(req, res){
  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
    if(err){
      req.flash("error", err.message);
      res.redirect("back");
    } else {
      req.flash("success", "Succesfully Updated!");
      res.redirect("/users/" + req.params.id);
    }
  });
});

module.exports = router;