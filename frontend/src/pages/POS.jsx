import React, { useState } from "react";
import ProductSearch from "../components/ProductSearch";
import Cart from "../components/Cart";

function POS() {
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemove = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleProcessPayment = () => {
    console.log("Payment processed for cart:", cart);
  };

  return (
    <div>
      <h2>Point of Sale System</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <ProductSearch onAddToCart={handleAddToCart} />
        </div>
        <div>
          <Cart 
            cart={cart} 
            onRemove={handleRemove} 
            onProcessPayment={handleProcessPayment}
            setCart={setCart}
          />
        </div>
      </div>
    </div>
  );
}

export default POS;