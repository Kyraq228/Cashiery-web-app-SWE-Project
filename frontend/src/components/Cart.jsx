import React from "react";
import { apiRequest } from "../api/api";

function Cart({ cart, onRemove, onProcessPayment, setCart, currentUser }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProcessPayment = async () => {
    if (cart.length === 0) return;
    
    try {
      await apiRequest("/transactions", "POST", {
        cashierId: currentUser.id,  // Add cashier ID from currentUser
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: total
      });
      
      if (setCart) {
        setCart([]);
      }
      if (onProcessPayment) {
        onProcessPayment();
      }
      alert("Payment processed successfully!");
    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed: " + err.message);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemove(itemId);
      return;
    }
    
    if (setCart) {
      setCart(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  return (
    <div>
      <h3>Cart ({cart.length} items)</h3>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <div>
                    Price: ${item.price} each
                  </div>
                  <div>
                    Quantity: 
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span style={{ margin: '0 0.5rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div>
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '1rem 0' }}>
            Total: ${total.toFixed(2)}
          </div>
          <button onClick={handleProcessPayment} disabled={cart.length === 0}>
            Process Payment
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;