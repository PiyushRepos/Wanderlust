const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

// root
app.get("/", (req, res) => {
  res.send("HI, I'm root");
});

// index
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs", { allListings });
  })
);

// new
app.get("/listings/new", async (req, res) => {
  res.render("new.ejs");
});

// create
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    if(!req.body.listing) res.status(400).json({message: "please send valid data to create listing", error: "invalid request"})
    await newListing.save();
    res.redirect("/listings");
  })
);

// show edit
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
  })
);

// edit
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// Delete
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

// show
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing });
  })
);

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "<h1>Page Not Found!</h1>"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!"} = err;
  res.render("error.ejs", { message});
});

app.listen(8080, () => {
  console.log("Listening on port http://localhost:8080");
});
