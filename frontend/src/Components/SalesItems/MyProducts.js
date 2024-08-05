import React, { useState, useEffect } from "react";
import "../../Styles/MyProducts.css";
import { decodeToken } from "../../Utils/auth";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const apiUrl=process.env.REACT_APP_URL;

  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/sales/productsbyid?userId=${userId}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched products:", data.products);
        setProducts(data.products);
      } else {
        console.error("Error fetching products:", response.status);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleEdit = (product) => {
    setEditedProduct(product);
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setEditedProduct({ ...editedProduct, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  try {
    // Send edited product data to backend
    const formData = new FormData();
    formData.append("id", editedProduct.id); // Append the ID to the form data
    formData.append("userId", userId);
    for (const key in editedProduct) {
      // Skip appending the image if it's null
      if (key === "image" && editedProduct[key] === null) {
        continue;
      }
      formData.append(key, editedProduct[key]);
    }

    const response = await fetch(`${apiUrl}/sales/editproduct`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to edit product");
    }

    // Refresh product list
    fetchProducts();
    setEditModalOpen(false);
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">My Products</h1>

      {/* Product List */}
      <div className="d-flex justify-content-center flex-wrap ">
        {products.map((product, index) => (
          <div key={index} className="card mb-3 mx-2" style={{maxWidth:'30vw'}}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={`${apiUrl}/${product.image}`} // Assuming the product object has an 'image' property
                  alt="Product"
                  className="img-fluid"
                  style={{
                    
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">Category: {product.category}</p>
                  <p className="card-text">
                    Description: {product.description}
                  </p>
                  <p className="card-text">Price: ${product.price}</p>
                  <p className="card-text">Stock: {product.quantity}</p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal" id="editModal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="productName" className="form-label">
                      Product Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productName"
                      name="name"
                      value={editedProduct.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productCategory" className="form-label">
                      Category:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productCategory"
                      name="category"
                      value={editedProduct.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">
                      Description:
                    </label>
                    <textarea
                      className="form-control"
                      id="productDescription"
                      name="description"
                      value={editedProduct.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productPrice" className="form-label">
                      Price:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productPrice"
                      name="price"
                      value={editedProduct.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productStock" className="form-label">
                      Stock:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="productStock"
                      name="quantity"
                      value={editedProduct.quantity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImage" className="form-label">
                      Product Image:
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="productImage"
                      name="image"
                      
                      onChange={handleImageChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
