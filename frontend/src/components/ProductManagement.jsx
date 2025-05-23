import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/api";

function ProductManagement({ onProductChange }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", SKU: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/products");
      const sortedProducts = [...(data.products || data || [])].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setProducts(sortedProducts);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        SKU: form.SKU.trim() === "" ? null : form.SKU
      };

      if (editingId) {
        await apiRequest(`/products/${editingId}`, "PUT", productData);
        setEditingId(null);
      } else {
        await apiRequest("/products", "POST", productData);
      }
      
      setForm({ name: "", price: "", stock: "", SKU: "" });
      await fetchProducts();
      if (onProductChange) onProductChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      SKU: product.SKU || product.sku || ""
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await apiRequest(`/products/${id}`, "DELETE");
      await fetchProducts();
      if (onProductChange) onProductChange();
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    }
  };

  const cancelEdit = () => {
    setForm({ name: "", price: "", stock: "", SKU: "" });
    setEditingId(null);
  };

  if (loading && products.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="product-management">
      <h3>Product Management</h3>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            type="number"
            step="0.01"
            min="0"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            type="number"
            min="0"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            name="SKU"
            placeholder="SKU (optional)"
            value={form.SKU}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="cancel-btn">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="product-list">
        <h4>Current Products ({products.length})</h4>
        {products.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          <ul className="products">
            {products.map(product => (
              <li key={product.id} className="product-item">
                <div className="product-info">
                  <strong className="product-name">{product.name}</strong>
                  <div className="product-detail">Price: ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</div>
                  <div className={`product-detail ${product.stock < 10 ? 'low-stock' : ''}`}>
                    Stock: {product.stock}
                  </div>
                  {(product.SKU || product.sku) && (
                    <div className="product-detail">SKU: {product.SKU || product.sku}</div>
                  )}
                </div>
                <div className="product-actions">
                  <button 
                    onClick={() => handleEdit(product)} 
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductManagement;