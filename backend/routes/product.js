const express = require("express");
const router = express.Router();

const products = require("../controllers/productController");



router.post("/create", products.create);

router.get("/all", products.getAllProducts);

router.get("/search", products.search);

router.get("/:productId", products.getProductById);

router.get("/:productName", products.getProductByName);



module.exports = router;