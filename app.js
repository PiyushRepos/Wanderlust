const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));

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

app.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", {allListings});
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("show.ejs", { listing })
});

app.listen(8080, () => {
  console.log("Listening on port http://localhost:8080");
});
