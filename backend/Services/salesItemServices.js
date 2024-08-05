//salesItemServices.js
const db = require("../Config/database");

const addItem = async (
  name,
  category,
  description,
  price,
  quantity,
  image,
  userId
) => {
  try {
    const query = `
      INSERT INTO products (name, category, description, price, quantity, image, userId, uploadTimestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    // Execute the query with parameters and await the result
    const result = await db.execute(query, [
      name,
      category,
      description,
      price,
      quantity,
      image,
      userId,
    ]);

    // Return the inserted row(s) from the query result
    return result[0];
  } catch (error) {
    throw error;
  }
};

// Service function to fetch products based on category
// Service function to fetchproducts based on category
const getProductsByCategory = async (category) => {
  try {
    if (category === "all") {
      const query = `
      SELECT *
      FROM products
     ;
    `;

      // Execute the query with parameters and await the result
      const result = await db.promise().execute(query, [category]);

      // Access the retrieved products based on library configuration
      const products = result[0];

      // If no products are found, return an empty array
      if (!products || !products.length) {
        return [];
      }

      // Return the fetched products
      return products;
    } else {
      // Define the SQL query to fetch products based on category
      const query = `
        SELECT *
        FROM products
        WHERE category = ?;
        `;

      // Execute the query with parameters and await the result
      const result = await db.promise().execute(query, [category]);

      // Access the retrieved products based on library configuration
      const products = result[0];

      // If no products are found, return an empty array
      if (!products || !products.length) {
        return [];
      }

      // Return the fetched products
      return products;
    }
  } catch (error) {
    throw error;
  }
};

const getProductsById = async (userId) => {
  try {
    // Check if userId is provided
    if (!userId) {
      throw new Error("User ID is required");
    }

    console.log("Received userId in getProductsById:", userId);

    // Define the SQL query to fetch products by user ID
    const query = `
      SELECT *
      FROM products
      WHERE userId = ?;
    `;

    console.log("Executing query with userId:", userId);

    // Execute the query with parameters and await the result
    const [rows] = await db.promise().execute(query, [userId]);

    // If no products are found, return an empty array
    if (!rows || !rows.length) {
      console.log("No products found for the given user ID");
      return [];
    }

    // Return the fetched products
    console.log("Returning fetched products:", rows);
    return rows;
  } catch (error) {
    console.error("Error in getProductsById:", error);
    throw error;
  }
};
const getProductsByProductId = async (id) => {
  try {
    // Check if userId is provided
    if (!id) {
      console.log("Product ID is not provided");
      throw new Error("Product ID is required");
    }

    console.log("Received Product in getProductsByProductId:", id);

    // Define the SQL query to fetch products by user ID
    const query = `
      SELECT *
      FROM products
      WHERE id = ?;
    `;

    console.log("Executing query with product:", id);

    // Execute the query with parameters and await the result
    const [rows] = await db.promise().execute(query, [id[0]]);

    // If no products are found, return an empty array
    if (!rows || !rows.length) {
      console.log("No products found for the given product ID");
      return [];
    }

    // Return the fetched products
    console.log("Returning fetched products:", rows);
    return rows;
  } catch (error) {
    console.error("Error in getProductsById:", error);
    throw error;
  }
};
const editProduct = async (
  id,
  name,
  category,
  description,
  price,
  quantity,
  image
) => {
  try {
    console.log(
      "PARAMETERS:",
      id[0],
      name,
      category,
      description,
      price,
      quantity,
      image
    );
    let query = "";
    if (image === null) {
      query = `
      UPDATE products
      SET name = ?, category = ?, description = ?, price = ?, quantity = ?
      WHERE id = ?;
    `;
      await db
        .promise()
        .execute(query, [name, category, description, price, quantity, id[0]]);
    } 
    else {
      query = `
      UPDATE products
      SET name = ?, category = ?, description = ?, price = ?, quantity = ?, image = ?
      WHERE id = ?;
      `;
      await db
        .promise()
        .execute(query, [
          name,
          category,
          description,
          price,
          quantity,
          image,
          id[0],
        ]);
    }

    // Execute the query with parameters
  } catch (error) {
    throw error;
  }
};
// Modified insertOrder service function
const insertOrder = async (orderDetails) => {
  try {
    console.log('Inserting order with details:', orderDetails);
    
    // Execute the insert query
    const [result] = await db.promise().execute(
      'INSERT INTO orders (userId, total_amount, status, razorpay_order_id) VALUES (?, ?, ?, ?)',
      [
        orderDetails.user_id,
        orderDetails.total_amount,
        orderDetails.status,
        orderDetails.razorpay_order_id
      ]
    );

    console.log('Database insert result:', result);

    // Check if the result contains an insertId
    if (result && result.insertId) {
      return result.insertId;
    } else {
      throw new Error('Failed to retrieve insertId from the database result');
    }
  } catch (error) {
    console.error('Error inserting order:', error);
    throw new Error('Failed to insert order: ' + error.message);
  }
};

module.exports = {
  addItem,
  getProductsByCategory,
  getProductsById,
  editProduct,
  getProductsByProductId,
  insertOrder
};
