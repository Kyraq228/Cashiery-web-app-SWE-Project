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

  const handleProcessPayment = async () => {
    // TODO: Send transaction to backend
    setCart([]);
    alert("Payment processed!");
  };

  return (
    <div>
      <h2>Point of Sale</h2>
      <ProductSearch onAddToCart={handleAddToCart} />
      <Cart cart={cart} onRemove={handleRemove} onProcessPayment={handleProcessPayment} />
    </div>
  );
}

export default POS;