const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route (list all listings)
router.get("/", listingController.index);

// New Route (form to create a new listing)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create Route (handles creation of a new listing)
router.post("/add",isLoggedIn, upload.single("listing[image]"), listingController.addNewListing);


// Show Route (show details of a specific listing)
router.get("/:id", listingController.showListing);

// Edit Route (form to edit an existing listing)
router.get("/:id/edit", isLoggedIn, listingController.editListing);

// Update Route (handles updating an existing listing)
router.put("/:id",isLoggedIn, upload.single("listing[image]"), listingController.updateListing);

//delete route
router.delete("/:id/delete",isLoggedIn, listingController.deleteListing);


module.exports = router ;