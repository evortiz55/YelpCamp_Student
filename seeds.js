var mongoose = require('mongoose'),
    Comment  = require('./models/comment'),
    Campground = require('./models/campground');

var data = [
    {
        name: "Tiki Tiki Village",
        image: "https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "The amazing tiki tiki get away, live like a native american Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu condimentum odio. Cras tristique sapien magna, sit amet fringilla purus ultrices eget. Sed faucibus nibh libero, a ultricies quam mollis eu. Mauris semper sollicitudin nisi vel vulputate. Vivamus sodales augue eget malesuada luctus. Suspendisse a ex in lorem semper fringilla vitae non enim. Curabitur ac nisi venenatis, congue lacus id, facilisis augue. Quisque sagittis ullamcorper congue."
    },
    {
        name: "Morning Coffe Woods",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Wake up to a hot coffee on a foggy morning Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu condimentum odio. Cras tristique sapien magna, sit amet fringilla purus ultrices eget. Sed faucibus nibh libero, a ultricies quam mollis eu. Mauris semper sollicitudin nisi vel vulputate. Vivamus sodales augue eget malesuada luctus. Suspendisse a ex in lorem semper fringilla vitae non enim. Curabitur ac nisi venenatis, congue lacus id, facilisis augue. Quisque sagittis ullamcorper congue."
    },
    {
        name: "By The Lake",
        image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
        description: "Amazing views for a romantic get away Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras eu condimentum odio. Cras tristique sapien magna, sit amet fringilla purus ultrices eget. Sed faucibus nibh libero, a ultricies quam mollis eu. Mauris semper sollicitudin nisi vel vulputate. Vivamus sodales augue eget malesuada luctus. Suspendisse a ex in lorem semper fringilla vitae non enim. Curabitur ac nisi venenatis, congue lacus id, facilisis augue. Quisque sagittis ullamcorper congue."
    }
]

function seedDB(){
    // Remove All campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("removed campgrounds!");
        // Remove All coments
        Comment.deleteMany({}, function(err){
            if(err){
                console.log(err)
            }
            console.log("removed comments!")
                // Add a few campgrounds
                data.forEach(function(seed){
                    Campground.create(seed, function(err, campground){
                        if(err){
                            console.log(err)
                        } else {
                            console.log("Added a Campgrounds")
                                // Create a comment on each campgrounds
                                Comment.create(
                                    {
                                        text: "This place is great but no wifi",
                                        author: "Homer S."
                                    }, function(err, comment){
                                        if(err){
                                            console.log(err)
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                            console.log("created new comment")
                                        };
                                    });
                                };
                    });
                });
            })

        });
}

module.exports = seedDB;
