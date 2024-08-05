//salesItemController.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const razorpay = require('razorpay');

// Configure Multer to store files in a specific directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./sales_items/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique file name
  },
});

// Create multer instance with the configured storage options
const upload = multer({ storage: storage });

// Import salesItemServices to call the addItem function
const salesItemServices = require("../Services/salesItemServices");

// Function to handle file uploading and adding sales item
const addItem = async (req, res) => {
  try {
    // Handle file upload
    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      } else if (err) {
        // Other error occurred
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // File upload successful, extract form data and file information
      const { name, category, description, price, quantity, userId } = req.body;
      const image = req.file ? req.file.path : null; // Store file path in database

      // Call service function to add the sales item into the database
      await salesItemServices.addItem(
        name,
        category,
        description,
        price,
        quantity,
        image,
        userId
      );

      // Send response
      res.status(201).json({ message: "Sales item added successfully" });
    });
  } catch (error) {
    console.error("Error adding sales item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controllers function to fetch products based on category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    // Call service function to fetch products based on category
    const products = await salesItemServices.getProductsByCategory(category);

    // Send response with the fetched products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to fetch products by user ID
const getProductsById = async (req, res) => {
  try {
    const { userId } = req.query;

    console.log("UUUSSSER:", userId);

    // Call service function to fetch products by user ID
    const products = await salesItemServices.getProductsById(userId);

    // Send response with the fetched products
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to edit a product
const editProduct = async (req, res) => {
  try {
    // Handle file upload
    upload.single("image")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      } else if (err) {
        // Other error occurred
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Extract product details from request body
      const { id, userId, name, category, description, price, quantity } =
        req.body;
      console.log("UserIIDDD", userId);
      console.log("IIDDD", id);
      // Call service function to get the old image path
      const oldProduct = await salesItemServices.getProductsByProductId(id);

      // Log the old image path for debugging
      console.log("Old", oldProduct[0].image);
      
      // Delete the old image file if it exists
      if (oldProduct[0] && oldProduct[0].image) {
        try {
          fs.unlinkSync(oldProduct[0].image);
          console.log("Old image deleted successfully");
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
      

      // Call service function to edit the product
      await salesItemServices.editProduct(
        id,
        name,
        category,
        description,
        price,
        quantity,
        req.file ? req.file.path : null
      );

      // Send success response
      res.status(200).json({ message: "Product updated successfully" });
    });
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Initialize Razorpay with your API keys
const rzp = new razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const checkout = async (req, res) => {
  try {
    console.log('Checkout request body:', req.body);
    
    const { cart, userId } = req.body;
    if (!userId) {
      throw new Error('User ID is missing');
    }

    console.log('Cart:', cart);
    if (!Array.isArray(cart) || cart.length === 0) {
      throw new Error('Cart is invalid or empty');
    }

    cart.forEach(product => {
      if (isNaN(parseFloat(product.price))) {
        throw new Error(`Invalid product price: ${product.price}`);
      }
    });

    const totalAmount = cart.reduce((total, product) => {
      return total + parseFloat(product.price);
    }, 0);

    console.log('Creating Razorpay order with amount:', totalAmount * 100);
    const order = await rzp.orders.create({
      amount: totalAmount * 100, // Amount is in paise (currency subunits)
      currency: 'INR',
      receipt: 'receipt#1',
      payment_capture: 1 // Automatically capture payment after order creation
    });
    console.log('Razorpay order created:', order);

    console.log('Inserting order into database with details:', {
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      razorpay_order_id: order.id
    });
    const orderId = await salesItemServices.insertOrder({
      user_id: userId,
      total_amount: totalAmount,
      status: 'pending',
      razorpay_order_id: order.id
    });
    console.log('Order inserted with ID:', orderId);

    if (orderId) {
      res.status(200).json({ message: 'Checkout successful', order });
    } else {
      throw new Error('Failed to process checkout');
    }
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
};

module.exports = {
  addItem,
  getProductsByCategory,
  getProductsById,
  editProduct,
  checkout
};
