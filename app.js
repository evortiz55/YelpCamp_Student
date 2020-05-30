var  express        = require('express'),
     app            = express(),
     bodyParser     = require('body-parser'),
     mongoose       = require('mongoose'),
     flash          = require('connect-flash'),
     passport       = require('passport'),
     LocalStrategy  = require('passport-local'),
     methodOverride = require('method-override'),
     Campground     = require('./models/campground'), //remeber that is need to be capitalized
     Comment        = require('./models/comment'),
     User           = require('./models/user'),
     seedDB         = require('./seeds');

var commentRoutes       = require('./routes/comments'),
    campgroundRoutes    = require('./routes/campgrounds'),
    indexRoutes         = require('./routes/index');

mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb+srv://evortiz55:Cathay74@cluster0-vbnlb.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Seed the DB
// seedDB();

// Passport Confing
app.use(require('express-session')({
    secret: "I love Yorkito",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass current user on all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function (){
	console.log("Yelp Camp Server Has Started!!!")
});