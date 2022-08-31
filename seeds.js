var mongoose = require("mongoose");
var Book = require("./models/book");
var Comment = require("./models/comment");


var data = [
        {
            name: "Managing OneSelf", 
            author: "Peter Drucker", 
            image: "http://5d9e9f5f927e41e7a64c-de8da85d2ccee5de1292ed7f6f96d59a.r86.cf1.rackcdn.com/medialib/1392938511.af585f2888b3b620ed1a0530395e0ad6.jpg", 
            description: "Why did Richard Branson, Leonardo DaVinci, and Mozart achieve 10,000 times more than us mere mortals?  Peter Drucker says it's because they were masters at self-management. Find out why today's book of the day may be one of the most powerful little books I've read."
        },
        {
            name: "Evolutionary Psychology: The New Science of the Mind",
            author: "David Buss",
            image: "http://5d9e9f5f927e41e7a64c-de8da85d2ccee5de1292ed7f6f96d59a.r86.cf1.rackcdn.com/medialib/1421787194.77b336aa65a71c589a84e83398d5fa94.jpg",
            description:"Blah blah BlahbLahblah"
        },
          {
            name: "How to win friends and influence people",
            author: "Dale Carnegie",
            image: "http://5d9e9f5f927e41e7a64c-de8da85d2ccee5de1292ed7f6f96d59a.r86.cf1.rackcdn.com/medialib/1452132962.adb34a3f9e65ce788e1dcf7c0842dd38.jpg",
            description:"How to win friends and influence people"
        },
          {
            name: "Total Recall",
            author: "Arnold Swarzenegger",
            image: "http://5d9e9f5f927e41e7a64c-de8da85d2ccee5de1292ed7f6f96d59a.r86.cf1.rackcdn.com/medialib/1403306005.1403306005.jpeg",
            description:"Auto Biography of Arnold Swarzenegger"
        }
    ]


function seedDB(){
    //Remove all books
    Book.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed books");   
                //add a few books
            data.forEach(function(seed){
                Book.create(seed, function(err, book){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a book");
                        //Create a comment
                        Comment.create({
                            text:"Books are great",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                book.comments.push(comment);
                                book.save();
                                console.log("Created Comment");
                            }
                            
                        });
                    }
            });
    });
        }
        
    });

    //add a few comments
    
}

module.exports = seedDB;