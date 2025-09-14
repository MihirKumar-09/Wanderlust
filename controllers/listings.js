//!-----REQUIRE LISTINGS------
const Listing = require("../models/listing.js");
//!-----INDEX ROUTE OR HOME ROUTE------
// module.exports.indexROute = async (req, res) => {
//   let { category } = req.query;

//   let allListings;
//   if (category) {
//     allListings = await Listing.find({ category: category.toLowerCase() });
//     res.render("listings/index", { allListings, filter: category });
//   } else {
//     allListings = await Listing.find({});
//     res.render("listings/index", { allListings, filter: "All" });
//   }
// };

module.exports.indexROute = async (req, res) => {
  let { category, search } = req.query; // 👈 Work for category and search

  let query = {};

  // if category is selected
  if (category) {
    query.category = category.toLowerCase();
  }

  // if search text is entered
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  let allListings = await Listing.find(query);

  res.render("listings/index", {
    allListings,
    filter: category || "All",
    search: search || "",
  });
};

//!-----CREATE ROUTE WHERE FROM IS OPEN------
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};
// POST ROUTE WHERE USER POST THE NEW LISTING
module.exports.postNewListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing); //Extract data, it is simple
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//!-----EDIT ROUTE------
module.exports.editRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    res.flash("error", "This listing is not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE ROUTE
module.exports.updateRoute = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // spread operator (...) to spread the properties of req.body.listing directly into the update object.

  if (!listing) {
    next(new ExpressError(404, "Bad Request"));
  }

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("edit", "Listing edit successfully");
  res.redirect(`/listings/${id}`);

  // or we can deconstuct like:
  // let { id } = req.params;
  // const { title, description, price, location, country, image } =
  //   req.body.listing;
  // await Listing.findByIdAndUpdate(id, {
  //   title,
  //   description,
  //   price,
  //   location,
  //   country,
  //   image,
  // });
  // res.redirect(`/listings/${id}`);
};

//!----DELETE ROUTE------
module.exports.deleteRoute = async (req, res) => {
  let { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  req.flash("delete", "Listing delete successfully!");
  res.redirect("/listings");
};

//!------SHOW ROUTE-----
module.exports.showRoute = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not exist");
    res.redirect("/listings");
  } else {
    res.render("listings/show", { listing });
  }
};
// //!Filter Route;
// module.exports.filterRoute = async (req, res) => {
//   let { category } = req.params;
//   let filterListings = await Listing.find({ category: category.toLowerCase() });
//   res.render("listings/index", {
//     allListings: filterListings,
//     filter: category,
//   });
// };
