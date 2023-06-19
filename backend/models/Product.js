const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        productName: { 
            type: String,
            required: true,
        },
        productCategory: { 
            type: String, 
            required: true,
        },
        productRef: { 
            type: String,
            required: true,
            unique: true,
        }, 
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;