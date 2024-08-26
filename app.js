if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer  = require('multer')
const dbUrl = process.env.ATLASDB_URL;

const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then(() => console.log("Connection successful")).catch(console.error);

async function main() {
    await mongoose.connect(dbUrl);
}

const Store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24* 3600,
});

Store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", error);
})
// Session Configuration
const sessionOptions = {
    Store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true
    }
};


app.use(session(sessionOptions));

// Flash Messages
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Middleware for Flash Messages and User Data
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.get("/", (req, res) => {
    res.redirect("/Listings"); // Render an EJS template instead
});

app.use("/", userRouter);
app.use("/listings", listingRouter); // Consider using lowercase URLs
app.use("/listings/:id/reviews", reviewRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.status(500).redirect("/"); // Redirect to the home page with an error flash
});

// Start Server
app.listen(8080, () => {
    console.log("Listening on port 8080");
});
