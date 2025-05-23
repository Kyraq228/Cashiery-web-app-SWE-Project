import React, { useEffect, useState } from "react";

function TransactionLog() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
          setError(data.error || "Failed to load transactions");
        }
      })
      .catch(() => {
        setTransactions([]);
        setError("Failed to load transactions");
      });
  }, []);

  return (
    <div>
      <h4>Transaction Log</h4>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {(transactions || []).map(tx => (
          <li key={tx.id}>
            {new Date(tx.timestamp).toLocaleString()}: {tx.username} completed a purchase transaction of items with a total value of ${tx.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionLog;