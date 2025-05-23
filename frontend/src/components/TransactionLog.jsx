import React, { useEffect, useState } from "react";

function TransactionLog() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/transactions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  return (
    <div>
      <h4>Transaction Log</h4>
      <ul>
        {transactions.map(tx => (
          <li key={tx.id}>
            {new Date(tx.created_at).toLocaleString()}: {tx.username} sold {tx.items.length} items for ${tx.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionLog;