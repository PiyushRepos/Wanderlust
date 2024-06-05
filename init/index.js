const mongoose = require("mongoose");
const initDb = require("./init.js");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

const initDB = async () =>{
   await Listing.deleteMany({});
   await Listing.insertMany(initDb.data);
    console.log("Data inserted successfully");
}

initDB();