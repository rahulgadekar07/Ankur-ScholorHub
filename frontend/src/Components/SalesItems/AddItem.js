import React, { useState } from "react";
import { decodeToken } from "../../Utils/auth";
import { useNavigate } from "react-router-dom";

const AddItem = () => {
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "", // New field for product quantity or stock
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file,
    });
  };

  const handleProductUpload = async (e) => {
    e.preventDefault();
    console.log("File data in handleProductUpload:", formData.image);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("quantity", formData.quantity); // Append quantity
    formDataToSend.append("userId", userId);
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/sales/additem", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Product Uploaded Successfully!");

        setFormData({
          name: "",
          category: "",
          description: "",
          price: "",
          quantity: "",
          image: null,
        });
        navigate("/");
      } else {
        throw new Error("Failed to upload product");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Failed to upload product. Please try again later.");
    }
  };

  return (
    <div className="container m-5 px-4 d-flex justify-content-center  " >
      <div className="col-md-8 ">
        <div className="card shadow" >
          <div className="card-body" >
            <h2 className="card-title text-center mb-4">Upload Items for Sale</h2>
            <form onSubmit={handleProductUpload} >
              <div className="form-group my-1">
                <label htmlFor="productName">Product Name:- </label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group my-1">
                <label htmlFor="productCategory">Product Category:- </label>
                <select
                  className="form-control"
                  id="productCategory"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  <option value="Jewelry">Jwellery</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Art">Art</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="form-group my-1">
                <label htmlFor="productDescription">Product Description:-</label>
                <textarea
                  className="form-control"
                  id="productDescription"
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                ></textarea>
              </div>
              <div className="form-group my-1">
                <label htmlFor="productPrice">Product Price:- </label>
                <input
                  type="number"
                  className="form-control"
                  id="productPrice"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter product price"
                />
              </div>
              <div className="form-group my-1">
                <label htmlFor="productQuantity">Product Quantity:- </label>
                <input
                  type="number"
                  className="form-control"
                  id="productQuantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter product quantity"
                />
              </div>
              <div className="form-group my-3 d-flex flex-column">
                <label htmlFor="productImage">Product Image:- </label>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="productImage"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <label className="custom-file-label" htmlFor="productImage">
                    Choose file...
                  </label>
                </div>
              </div>
              <div className="text-center d-flex flex-column my-1">
                <button type="submit" className="btn btn-primary my-1">
                  Upload Product
                </button>
                <button
                  type="reset"
                  className="btn btn-primary my-1"
                  onClick={() =>
                    setFormData({
                      name: "",
                      category: "Textiles",
                      description: "",
                      price: "",
                      quantity: "",
                      image: null,
                    })
                  }
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
