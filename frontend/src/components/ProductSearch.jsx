import React, { useState } from "react";

function ProductSearch({ onAddToCart }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    // TODO: Replace with your backend API endpoint
    const res = await fetch(`/api/products?search=${query}`);
    const data = await res.json();
    setResults(data.products || []);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search or scan product"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map(product => (
          <li key={product.id}>
            {product.name} (${product.price}) - Stock: {product.stock}
            <button onClick={() => onAddToCart(product)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductSearch;