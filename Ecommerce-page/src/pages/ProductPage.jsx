import { useEffect, useState } from "react";
import "./ProductPage.css";

export default function ProductPage() {

  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);

  // ✅ FETCH PRODUCTS FROM DB
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Products:", data);
        setProducts(data);
      });
  }, []);

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    console.log("Sending ID:", product._id); // DEBUG

    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,   // 🔥 IMPORTANT
      }),
    });

    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // ✅ BUY NOW
  const buyNow = async () => {
    const res = await fetch("http://localhost:5000/api/buy", {
      method: "POST",
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="page">

      <h2 className="heading">Our Products</h2>

      <div className="grid">
        {products.map((item) => (
          <div className="card" key={item._id}>

            <img src={item.image} alt={item.name} />

            <div className="card-body">
              <h3>{item.name}</h3>

             

              <p className="price">₹{item.price}</p>

              <button
                className="add-btn"
                onClick={() => addToCart(item)}
              >
                {addedId === item._id ? "Added ✅" : "Add to Cart"}
              </button>

            </div>

          </div>
        ))}
      </div>

      <button className="buy-all-btn" onClick={buyNow}>
        Buy Now
      </button>
     <button className="add-product-btn" onClick={() => window.location.href="/add"}>
  ➕ Add Product
</button>
    </div>
  );
}