import React, { useEffect, useState } from "react";

function InventoryAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("/api/products/low-stock", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setAlerts(data.products || []));
  }, []);

  return (
    <div>
      <h4>Low Stock Alerts</h4>
      <ul>
        {alerts.map(product => (
          <li key={product.id}>
            {product.name} - Only {product.stock} left!
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InventoryAlerts;