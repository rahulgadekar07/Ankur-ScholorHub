import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Market.css";
import { decodeToken } from "../Utils/auth";

import PopupAlert from "../Components/Alerts/PopupAlert";
import ConfirmBox from "../Components/Alerts/ConfirmBox";

const Market = () => {
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });

  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    return () => {
      setShowCart(false);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/sales/products?category=${category}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = (product) => {
    setShowAlert(false);
    setCart([...cart, product]);
    setShowAlert(true);
    setAlertSettings({
      type: "success",
      message: "Product Added to Cart",
    });
  };

  const handleRemoveConfirm = (confirmed, index) => {
    if (confirmed) {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
    }
    setShowConfirmBox(false);
  };

  const handleRemoveFromCart = (index) => {
    setShowConfirmBox(true);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, product) => {
      const price = parseFloat(product.price);
      if (!isNaN(price)) {
        return total + price;
      }
      return total;
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const orderData = {
        cart,
        userId: decodedToken.userId, // Assuming you have the decoded token with user ID
      };
  
      const response = await fetch("http://localhost:5000/sales/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
  
      const options = {
        key: 'rzp_test_GWCh8fO2Clvot3',
        amount: getTotalPrice() * 100,
        // Other Razorpay options...
        handler: function (response) {
          const payment_id = response.razorpay_payment_id;
          orderData.payment_id = payment_id;
  
          // Update the order with payment_id on the backend
          fetch("http://localhost:5000/payment/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to process payment");
              }
              // Handle successful payment
              setShowAlert(true);
              setAlertSettings({
                type: 'success',
                message: 'Payment is Successfull! Thank You.',
              });
              setCart([]); // Clear the cart
            })
            .catch((error) => {
              console.error("Error processing payment:", error);
            });
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const toggleCartModal = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <div className="container-fluid py-4" style={{ marginBottom: "70px" }}>
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      {showConfirmBox && (
        <ConfirmBox
          message="Are you sure you want to remove this item?"
          onConfirm={handleRemoveConfirm}
        />
      )}
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
                      <label htmlFor="category" className="form-label">
                        Category:
                      </label>
                      <select
                        id="category"
                        className="form-select form-select-sm"
                        value={category}
                        onChange={handleCategoryChange}
                      >
                        <option value="all">All Categories</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Jewelry">Jewelry</option>
                      </select>
                    </div>
                    <div>
                      <button
                        className="btn btn-success"
                        onClick={toggleCartModal}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} /> Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <h2 className="mb-4">Products</h2>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product, index) => (
              <div key={index} className="col">
                <div className="card h-100">
                  <img
                    src={`http://localhost:5000/${product.image}`}
                    alt="Product"
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Category: {product.category}</p>
                    <p className="card-text">
                      Description: {product.description}
                    </p>
                    <p className="card-text">₹{product.price}</p>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCart && (
        <div
          className={`modal ${showCart ? "show d-block" : ""}`}
          tabIndex="-1"
          role="dialog"
          onClick={toggleCartModal}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Shopping Cart</h5>
                <button
                  type="button"
                  className="close"
                  onClick={toggleCartModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                  ) : (
                    <>
                      {cart.map((product, index) => (
                        <div key={index} className="cart-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{product.name}</strong> - ₹
                              {Number(product.price).toFixed(2)}
                            </div>
                            <button
                              className="btn btn-danger btn-sm my-1"
                              onClick={() => handleRemoveFromCart(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <p className="total">
                        Total: ₹{Number(getTotalPrice()).toFixed(2)}
                      </p>
                    </>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleCartModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;

