import React from 'react';
import ProductSearch from '../components/ProductSearch';
import Cart from '../components/Cart';

function POSPage() {
  const [cart, setCart] = React.useState([]);

  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div>
      <ProductSearch onAddToCart={handleAddToCart} />
      <Cart 
        cart={cart}
        onRemove={handleRemoveItem}
        onProcessPayment={() => console.log('Processing payment...')}
      />
    </div>
  );
}

export default POSPage;