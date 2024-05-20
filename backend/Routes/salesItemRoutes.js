//salesItemRoutes.js

const express = require("express");
const router = express.Router();
const salesItemController = require("../Controller/salesItemController");

// Import any middleware or controller functions you need

// Define the route for adding an item
router.post("/additem", salesItemController.addItem);
router.post("/checkout", salesItemController.checkout);

// Define the route for fetching products based on category
router.get("/products", salesItemController.getProductsByCategory);
router.get('/productsbyid', salesItemController.getProductsById);
router.put("/editproduct", salesItemController.editProduct);

module.exports = router;
