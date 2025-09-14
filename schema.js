// Require (joi) which is used for schema validation
const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(1000).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
    category: Joi.string()
      .valid(
        "trending",
        "tiny rooms",
        "amazing views",
        "iconic cities",
        "mountains",
        "beach",
        "snow",
        "amazing pools",
        "desert",
        "forest",
        "city",
        "village",
        "luxury",
        "castles",
        "omg"
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});
