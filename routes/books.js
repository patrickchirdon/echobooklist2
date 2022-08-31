var express = require("express");
var router  = express.Router();
var Book    = require("../models/book");
var middleware = require("../middleware");

//INDEX - show all books
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Book.find({name: regex}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              if(allBooks.length < 1) {
                  noMatch = "No books match that query, please try again.";
              }
              res.render("books/index",{books:allBooks, noMatch: noMatch});
           }
        });
    } else {
        // Get all books from DB
        Book.find({}, function(err, allBooks){
           if(err){
               console.log(err);
           } else {
              res.render("books/index",{books:allBooks, noMatch: noMatch});
           }
        });
    }
});


router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to books array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var amazonLink = req.body.amazonLink;
    var author = req.body.author;
    var description = req.body.description;
    var postAuthor ={
        id: req.user._id,
        username: req.user.username
    };
    var newBook = {name: name, image: image, price: price, amazonLink: amazonLink, author: author, description: description, postAuthor:postAuthor};
    
    //Create a new campground and save to DB
    Book.create(newBook, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
             //redirect back to books page
           console.log(newlyCreated);
           res.redirect("/books");
        }
    });
   
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("books/new");    
});

//SHOW ROUTE
router.get("/:id", function(req, res){
    //find the book with the provided Id
    
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
        if(err || !foundBook){
            req.flash("error","Sorry, that book does not exist!");
            return res.redirect("/books");
        } 
        console.log(foundBook);
        res.render("books/show", {book: foundBook});
    });
    
});

//edit campground route
router.get("/:id/edit",middleware.isLoggedIn, middleware.checkBookOwnership, function(req, res){
        Book.findById(req.params.id, function(err, foundBook){
                res.render("books/edit", {book: foundBook});
        });
});

//update campground route
router.put("/:id",middleware.checkBookOwnership, function(req, res){
    //find and update the correct book
    
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err){
            req.flash("error", err);
            res.redirect("/books");
        } else {
            req.flash("success", "book added");
            res.redirect("/books/" + req.params.id);
        }
    });
    //redirect somewhere
});

//Destroy route
router.delete("/:id/",middleware.checkBookOwnership, function(req, res){
    Book.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", err);
            res.redirect("/books");
        } else {
            req.flash("success","deleted");
            res.redirect("/books");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//Middleware



module.exports = router;