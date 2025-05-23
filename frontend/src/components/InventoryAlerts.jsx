import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

function InventoryAlerts({ refreshTrigger }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try the dedicated low-stock endpoint
      let data = await apiRequest("/products/low-stock");
      
      // If endpoint doesn't exist (404), fall back to filtering all products
      if (data.error && data.error.includes("404")) {
        data = await apiRequest("/products");
        data = data.filter(product => product.stock < 10);
      }
      
      // Handle case where data might be HTML (error page)
      if (typeof data === 'string' && data.startsWith('<!DOCTYPE')) {
        throw new Error("Server returned HTML instead of JSON");
      }

      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load inventory alerts");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockProducts();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchLowStockProducts, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [refreshTrigger]);

  if (loading && alerts.length === 0) {
    return <div>Loading inventory alerts...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error: {error}
        <div style={{ marginTop: '10px' }}>
          <button onClick={fetchLowStockProducts}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-alerts">
      <h3>Low Stock Alerts</h3>
      {alerts.length === 0 ? (
        <p>No products with critically low stock.</p>
      ) : (
        <ul>
          {alerts.map(product => (
            <li key={product.id}>
              <strong>{product.name}</strong> - Only {product.stock} units left
              {product.SKU && ` (SKU: ${product.SKU})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InventoryAlerts;