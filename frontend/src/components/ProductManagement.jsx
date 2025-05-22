import React, { useState, useEffect } from "react";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form),
    });
    setForm({ name: "", price: "", stock: "" });
    fetchProducts();
  };

  // Edit and delete handlers can be added similarly

  return (
    <div>
      <h3>Product Management</h3>
      <form onSubmit={handleAdd}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required type="number" />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required type="number" />
        <button type="submit">Add Product</button>
      </form>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} (${p.price}) - Stock: {p.stock}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductManagement;