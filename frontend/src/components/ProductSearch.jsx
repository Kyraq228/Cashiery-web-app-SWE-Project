import React, { useState } from "react";
import { apiRequest } from '../api/api';

function ProductSearch({ onAddToCart }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const data = await apiRequest(`/products?search=${encodeURIComponent(query)}`);
      setResults(data.products || data || []);
    } catch (err) {
      setError("Search failed: " + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await apiRequest('/products');
      setResults(data.products || data || []);
    } catch (err) {
      setError("Failed to load products: " + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Product Search</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products by name or scan barcode"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button type="button" onClick={loadAllProducts} disabled={loading}>
          Show All Products
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {results.length > 0 ? (
        <ul>
          {results.map(product => (
            <li key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <div>Price: ${product.price}</div>
                <div>Stock: {product.stock}</div>
                {product.sku && <div>SKU: {product.sku}</div>}
              </div>
              <button 
                onClick={() => onAddToCart(product)}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </li>
          ))}
        </ul>
      ) : !loading && query && (
        <p>No products found for "{query}"</p>
      )}
    </div>
  );
}

export default ProductSearch;