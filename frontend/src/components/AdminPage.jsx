import React from 'react';
import ProductManagement from '../components/ProductManagement';
import TransactionLog from '../components/TransactionLog';
import SalesSummary from '../components/SalesSummary';

function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ProductManagement />
      <SalesSummary />
      <TransactionLog />
    </div>
  );
}

export default AdminPage;