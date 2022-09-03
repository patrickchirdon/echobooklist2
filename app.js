// configure dotenv
require('dotenv').config();

var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Book       = require("./models/book"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    
var bookRoute = require("./routes/books"),
    commentRoute = require("./routes/comment"),
    indexRoute   = require("./routes/index"),
    userRoute    = require("./routes/users");

//Moment configuration
app.locals.moment = require("moment");

mongoose.connect(process.env.MONGODB_URI || " mongodb+srv://patrick:Tobyismycat1@cluster0.td6sf.mongodb.net/ebooks");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database


//Passport configuration
app.use(require("express-session")({
    secret: "Love you loves",
    resave: false,
    saveUninitialized:false
    
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/books", bookRoute);
app.use("/", userRoute);
app.use("/books/:id/comments",commentRoute);
app.use("/",indexRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


