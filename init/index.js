const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("Connection succesfull"); 
}).catch((err)=>{
    console.log(err);
});

 
async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj) => ({
        ...obj,
        owner: "66c9ae34b85ff06bd2beacdb"
    }));
    let result = await Listing.insertMany(modifiedData);
    console.log("data was saved");
}

initDB();