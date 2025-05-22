import React from "react";

function Cart({ cart, onRemove, onProcessPayment }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h3>Cart</h3>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} x{item.quantity} (${item.price * item.quantity})
            <button onClick={() => onRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div>Total: ${total.toFixed(2)}</div>
      <button onClick={onProcessPayment} disabled={cart.length === 0}>
        Process Payment
      </button>
    </div>
  );
}

export default Cart;