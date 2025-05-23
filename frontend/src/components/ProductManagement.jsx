import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", sku: "" });
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
      setProducts(data.products || data || []);
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
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };

      if (editingId) {
        await apiRequest(`/products/${editingId}`, "PUT", productData);
        setEditingId(null);
      } else {
        await apiRequest("/products", "POST", productData);
      }
      
      setForm({ name: "", price: "", stock: "", sku: "" });
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      sku: product.sku || ""
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await apiRequest(`/products/${id}`, "DELETE");
      fetchProducts();
    } catch (err) {
      setError("Failed to delete product: " + err.message);
    }
  };

  const cancelEdit = () => {
    setForm({ name: "", price: "", stock: "", sku: "" });
    setEditingId(null);
  };

  if (loading && products.length === 0) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h3>Product Management</h3>
      
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            name="name" 
            placeholder="Product Name" 
            value={form.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <input 
            name="price" 
            placeholder="Price" 
            value={form.price} 
            onChange={handleChange} 
            required 
            type="number" 
            step="0.01"
            min="0"
          />
        </div>
        <div>
          <input 
            name="stock" 
            placeholder="Stock Quantity" 
            value={form.stock} 
            onChange={handleChange} 
            required 
            type="number"
            min="0"
          />
        </div>
        <div>
          <input 
            name="sku" 
            placeholder="SKU (optional)" 
            value={form.sku} 
            onChange={handleChange} 
          />
        </div>
        <div>
          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <div className="error">{error}</div>}

      <div>
        <h4>Current Products ({products.length})</h4>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul>
            {products.map(product => (
              <li key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <div>Price: ${product.price}</div>
                  <div>Stock: {product.stock}</div>
                  {product.sku && <div>SKU: {product.sku}</div>}
                </div>
                <div>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{ backgroundColor: '#dc3545' }}
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