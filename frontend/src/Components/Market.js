import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../Styles/Market.css";
import { decodeToken } from "../Utils/auth";
import PopupAlert from "../Components/Alerts/PopupAlert";
import ConfirmBox from "../Components/Alerts/ConfirmBox";

const Market = () => {
  const apiUrl = process.env.REACT_APP_URL;

  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const [address, setAddress] = useState("");
  const [razorpayOrderId, setRazorpayOrderId] = useState(null);
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  useEffect(() => {
    return () => {
      setShowCart(false);
    };
  }, []);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/sales/products?category=${category}`
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
        userId: decodedToken.userId,
      };

      const response = await fetch(`${apiUrl}/sales/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order } = await response.json();
      setRazorpayOrderId(order.id);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddressSubmit = () => {
    if (!address) {
      setShowAlert(true);
      setAlertSettings({
        type: "warning",
        message: "Please enter your address.",
      });
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_ID,
      amount: getTotalPrice() * 100,
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: razorpayOrderId,
      handler: async (response) => {
        const payment_id = response.razorpay_payment_id;
        const orderData = {
          cart,
          userId: decodedToken.userId,
          address,
          payment_id,
          razorpay_order_id: razorpayOrderId,
        };

        try {
          const paymentResponse = await fetch(`${apiUrl}/sales/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (!paymentResponse.ok) {
            throw new Error("Failed to process payment");
          }

          setShowAlert(true);
          setAlertSettings({
            type: "success",
            message: "Payment Successful! Thank You.",
          });
          setCart([]);
          setShowCart(false);
        } catch (error) {
          console.error("Error processing payment:", error);
          setShowAlert(true);
          setAlertSettings({
            type: "error",
            message: "Payment failed. Please try again.",
          });
        }
      },
      prefill: {
        name: "Rahul Gadekar",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      notes: {
        address,
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const toggleCartModal = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <div className="container-fluid py-4" style={{ marginBottom: "70px" }}>
      <center><h1 class="heartbeat my-2">Market Functionality is Under Development</h1></center>
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
                <h5 className="modal-title">Cart</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleCartModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {cart.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul className="list-group">
                    {cart.map((product, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <p className="mb-0">{product.name}</p>
                          <p className="mb-0">₹{product.price}</p>
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                {cart.length > 0 && (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-group">
                          <label htmlFor="address" className="form-label">
                            Delivery Address:
                          </label>
                          <input
                            type="text"
                            id="address"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 mt-2">
                        <p>Total: ₹{getTotalPrice()}</p>
                        <button
                          className="btn btn-success"
                          onClick={handleAddressSubmit}
                        >
                          Proceed to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
