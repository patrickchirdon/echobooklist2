var express = require("express");
var router = express.Router({mergeParams:true});
var Book    = require("../models/book");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    //find book by id
    console.log
    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {book:book});
        }
    });
   });
   
//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup book using id
    Book.findById(req.params.id, function(err, book){
        if(err){
            console.log(err);
            res.redirect("/books");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error","Something went wrong!");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    book.comments.push(comment);
                    book.save();
                    console.log(comment);
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/books/" + book._id);
                }
            });
        }
    });
});
//Comments EDIT
router.get("/:comment_id/edit",middleware.isLoggedIn, middleware.checkCommentOwnership,  function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        if(err || !foundBook){
            req.flash("error","No book found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           } else {
              res.render("comments/edit", {book_id: req.params.id, comment: foundComment});
           }
        });
   });
});
//COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});
//Comments destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comments deleted");
            res.redirect("/books/" + req.params.id);
        }
    });
});







module.exports = router;