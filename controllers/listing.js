const Listing = require("../models/listing.js")

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

// controllers/listing.js
module.exports.renderNewForm = (req, res) => {
    console.log("Rendering new listing form");
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/Listings");
    }
    res.render("listings/show", { listing });
};

module.exports.addNewListing = async(req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success", "New listing Created!");
    res.redirect("/Listings");
};

module.exports.editListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/Listings");
    }

    let originalUrl = listing.image.url;
    originalUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit", { listing, originalUrl });
}

module.exports.updateListing =  async(req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/Listings/${listing._id}`);
};

module.exports.deleteListing = async(req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        req.flash("success", "Listing Deleted!");
        res.redirect("/Listings");
    } catch (error) {
        console.error("Error deleting listing:", error);
        return res.status(500).send("Server error");
    }
};