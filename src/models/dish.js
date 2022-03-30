const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: [{
      type: String
    }],
    duration: {
      type: String
    },
    cookTime: {
      type: String
    },
  }
);

const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
