require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpresseError.js');
const session= require('express-session')
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const User = require("./models/users.js")
const multer  = require('multer')
const { cloudinary, storage } = require('./cloudConfig.js'); // Import cloudinary and storage configuration
const upload = multer({storage})




// ROUTES
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Mongoose Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASTDB_URL;
main().then(() => console.log("Connected to DB")).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// View Engine & Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



// mongodb seession store for express-session
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
})


store.on("error",()=>{
    console.log("seession store error",err)
})


// sesssion configuration
const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge:1000 * 60 * 60 * 24 * 7 // 7 days
    }
}


// Middleware
app.use(session(sessionOptions));
app.use(flash())
app.use(passport.initialize()) // Initialize passport middleware
app.use(passport.session()) // Use passport session middleware
passport.use(new LocalStrategy(User.authenticate())) // Use local strategy for authentication


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use((req, res, next) => {
    // res.locals.currentUser = req.session.currentUser; // Set currentUser in locals for all views
    res.locals.success = req.flash("success"); // Set success message in locals for all views
    res.locals.error = req.flash("error"); // Set error message in locals for all views
    res.locals.currentUser = req.user; // Set currentUser in locals for all views
    next(); // Call the next middleware function
}
);

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found!!", 404));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
    const message = err.message || "Something Went Wrong";
    res.status(statusCode).render("listings/error", { message, statusCode });
});


// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
