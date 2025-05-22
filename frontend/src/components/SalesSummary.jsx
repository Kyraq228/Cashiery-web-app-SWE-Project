import React, { useEffect, useState } from "react";

function SalesSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("/api/transactions/summary", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setSummary(data));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h4>Daily Sales Summary</h4>
      <div>Total Sales: ${summary.totalSales}</div>
      <div>Transactions: {summary.transactionCount}</div>
    </div>
  );
}

export default SalesSummary;