import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/cart")
      .then(res => res.json())
      .then(data => setCart(data));
  }, []);

  return (
    <div>
      <h1>Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty ❌</p>
      ) : (
        cart.map((item) => (
          <div key={item._id}>
            <p>{item.name}</p>
            <p>Qty: {item.quantity}</p>
            <p>Price: ₹{item.price}</p>
            <p>Total: ₹{item.total}</p>
          </div>
        ))
      )}
    </div>
  );
}
