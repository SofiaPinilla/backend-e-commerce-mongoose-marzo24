const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description:String,
  },
  { timestamps: true }
);

ProductSchema.index({
    name: "text",
  });
  
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
