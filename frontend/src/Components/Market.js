import React, { useState, useEffect } from 'react';
import '../Styles/Market.css'; // Import the CSS file for additional styling

const Market = () => {
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/sales/products?category=${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log("Fetched products:", data.products[0]); // Added log statement
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };
console.log("products:",products)
  return (
    <div className="container-fluid py-4" style={{marginBottom:'70px'}}>
      <h1 className="text-center mb-4">Market</h1>

      <div className="row">
        <div className="col-md-12">
          <div className="row mb-4">
            <div className="col-md-9 mx-auto">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title mb-3">Filters</h2>
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div>
                      <label htmlFor="category" className="form-label">Category:</label>
                      <select id="category" className="form-select form-select-sm" value={category} onChange={handleCategoryChange}>
                        <option value="all">All Categories</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Jwellery">Jewelry</option> {/* Corrected typo */}
                      </select>
                    </div>
                    {/* No need for a button, filters are applied automatically */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h2 className="mb-4">Products</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {/* Product cards */}
            {products.map((product, index) => (
              <div key={index} className="col">
                <div className="card h-100">
                  <img src={`http://localhost:5000/${product.image}`} alt="Product" className="card-img-top" style={{height:'250px', objectFit: 'cover'}}/>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Category: {product.category}</p>
                    <p className="card-text">Description: {product.description}</p>
                    <p className="card-text">₹{product.price}</p>
                    <button className="btn btn-primary btn-sm">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
            {/* End of product cards */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
