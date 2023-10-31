const Product = require("../models/Product");
const Elastic = require("../utils/elasticSearchUtil");

const create = async (req, res) => {
    if (!req.body.productName || !req.body.productCategory || !req.body.productRef) {
        res.status(400).send({
            message: "Fields cannot be empty!",
        });

        return;
    }

    const { productName, productCategory, productRef } = req.body;

    const foundProduct = await Product.findOne({ productRef: productRef });
    
    if (foundProduct) {
        return res.status(400).json({
            message: "Product already exist",
        });
    }

    let product = new Product({
        productName,
        productCategory,
        productRef,
    });

    try {
        // await Elastic.indexProduct(product);

        const savedProduct = await product.save();

        // Exclude the _id field when indexing the document, elastic search would generate its own _id field
        const { _id, ...productData } = savedProduct.toJSON();

        await Elastic.indexProduct(productData);
        
        res.status(200).send({
            message: "Product Created Successfully",
            data: savedProduct,
        });

    } catch (err) {

        console.log("Error while creating product --> " + err.message);

        res.status(500).send({
            message: "Some error occurred while creating Product",
        });
    }
};

const getAllProducts = async (req, res) => {

    try {
        const results = await Elastic.getAllDocuments("products");

        res.status(200).json({
            message: "Products found successfully",
            data: results,
        });


    } catch (err) {
        console.log("Error while retrieving all products --> " + err.message);
        res.status(500).send({
            message: "Some error occurred while retrieving all products",
        });
    }
};

const getProductById = async (req, res) => {
    const { productId } = req.params;
    Product.findById({ _id: productId })
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            res.status(200).json({
                message: "Product found successfully",
                data: product,
            });
        })
        .catch((err) => {
            console.log("Error while retrieving product by id --> " + err.message);
            res.status(500).send({
                message: "Some error occurred while retrieving product by id",
            });
        });
};

const getProductByName = async (req, res) => {
    const { productName } = req.params;
    Product.findOne({ productName: productName })
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                });
            }

            res.status(200).json({
                message: "Product found successfully",
                data: product,
            });
        })
        .catch((err) => {
            console.log("Error while retrieving product by productName --> " + err.message);
            res.status(500).send({
                message: "Some error occurred while retrieving product by productName",
            });
        });
};

const search = async (req, res) => {
    const { productName, productCategory } = req.query;


    try {
        let results = {};
        if(productName === undefined || productName === null) {
            results = await Elastic.searchIndexProductCategory(productCategory);
        } else {
            results = await Elastic.searchIndexProductName(productName);
        }
        
        res.status(200).json({
            message: "Products found successfully",
            data: results,
        });

    } catch (err) {
        console.log("Error while searching for product --> " + err.message);
        res.status(500).send({
            message: "Some error occurred while searching for product",
        });
    }
};

module.exports = {
    create,
    getAllProducts,
    getProductById,
    getProductByName,
    search
};
