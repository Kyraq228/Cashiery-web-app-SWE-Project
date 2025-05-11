function Cart({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name} - ${item.price}</div>)}
      <button onClick={processPayment}>Process Payment (${total})</button>
    </div>
  );
}