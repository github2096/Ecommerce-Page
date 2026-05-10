import { useEffect, useState } from "react";
import "./ProductPage.css";
import Navbar from "../components/Navbar";

export default function ProductPage() {

  const [products, setProducts] = useState([]);
  const [addedId, setAddedId] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");

  const [showUPI, setShowUPI] = useState(false);

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
      });
  }, []);

  // ✅ ADD TO CART
  const addToCart = async (product) => {

    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
      }),
    });

    setAddedId(product._id);

    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  // ✅ BUY NOW
  const buyNow = async () => {

    if (!selectedPayment) {
      alert("Select Payment Method ❌");
      return;
    }

    const res = await fetch("http://localhost:5000/api/buy", {
      method: "POST",
    });

    const data = await res.json();

    alert(`
Order Placed Successfully ✅

Payment:
${selectedPayment}

Total:
₹${data.totalAmount}
    `);

    setShowPayment(false);
    setShowUPI(false);
  };

  return (
    <div className="page">
      <Navbar />

      {/* HEADING */}
      <h2 className="heading">Our Products</h2>

      {/* PRODUCTS */}
      <div className="grid">

        {products.map((item) => (

          <div className="card" key={item._id}>

            {/* IMAGE */}
            <img src={item.image} alt={item.name} />

            {/* BODY */}
            <div className="card-body">

              <h3>{item.name}</h3>

              <p className="desc">
                {item.desc}
              </p>

              <p className="price">
                ₹{item.price}
              </p>

              {/* ADD BUTTON */}
              <button
                className="add-btn"
                onClick={() => addToCart(item)}
              >
                {addedId === item._id
                  ? "Added ✅"
                  : "Add to Cart"}
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* BUY BUTTON */}
      <button
        className="buy-all-btn"
        onClick={() => setShowPayment(true)}
      >
        Buy Now
      </button>

      {/* ADD PRODUCT */}
     {/* <button
        className="add-product-btn"
        onClick={() => window.location.href = "/add"}
      >
        ➕ Add Product
      </button>*/}

      {/* PAYMENT POPUP */}
      {showPayment && (

        <div className="payment-popup">

          <div className="payment-box">

            <h2>Select Payment Method</h2>

            {/* UPI */}
            <button
              onClick={() => {
                setSelectedPayment("UPI");
                setShowUPI(true);
                setShowPayment(false);
              }}
            >
              UPI
            </button>

            {/* CARD */}
            <button
              onClick={() =>
                setSelectedPayment("Card")
              }
            >
              Card
            </button>

            {/* COD */}
            <button
              onClick={() =>
                setSelectedPayment("Cash on Delivery")
              }
            >
              Cash on Delivery
            </button>

            <br /><br />

            {/* CONFIRM */}
            <button
              className="confirm-btn"
              onClick={buyNow}
            >
              Confirm Order
            </button>

            {/* CLOSE */}
            <button
              className="close-btn"
              onClick={() => setShowPayment(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* UPI POPUP */}
      {showUPI && (

        <div className="payment-popup">

          <div className="payment-box">

            <h2>Pay Using UPI</h2>

            {/* UPI APPS */}
            <div className="upi-apps">

              <button>
                Google Pay
              </button>

              <button>
                PhonePe
              </button>

              <button>
                Paytm
              </button>

            </div>

            {/* QR CODE */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi-payment-demo"
              alt="QR"
              className="qr-image"
            />

            <p>Scan QR to Pay</p>

            {/* PAYMENT DONE */}
            <button
              className="confirm-btn"
              onClick={() => {
                buyNow();
              }}
            >
              Payment Done
            </button>

            {/* CLOSE */}
            <button
              className="close-btn"
              onClick={() => setShowUPI(false)}
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}