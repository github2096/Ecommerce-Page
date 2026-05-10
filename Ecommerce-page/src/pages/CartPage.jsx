import { useEffect, useState } from "react";
import "./CartPage.css";

export default function CartPage() {

  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
const [selectedPayment, setSelectedPayment] = useState("");
const [showUPI, setShowUPI] = useState(false);

  // FETCH CART
  const fetchCart = async () => {
    const res = await fetch("http://localhost:5000/api/cart");
    const data = await res.json();

    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = async (id, action) => {

    await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });

    fetchCart();
  };

  // DELETE ITEM
  const deleteItem = async (id) => {

    await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "DELETE"
    });

    fetchCart();
  };

  // GRAND TOTAL
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.total,
    0
  );

  return (

    <div className="cart-page">

      <h1 className="cart-heading">
        Shopping Cart 🛒
      </h1>

      {cart.length === 0 ? (

        <h2>Cart is Empty ❌</h2>

      ) : (

        <>
          {cart.map((item) => (

            <div className="cart-card" key={item._id}>

              <img
                src={item.image}
                alt={item.name}
                className="cart-img"
              />

              <div className="cart-info">

                <h2>{item.name}</h2>

                <p>₹{item.price}</p>

                {/* QUANTITY */}
                <div className="qty-box">

                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item._id, "decrease")
                    }
                  >
                    -
                  </button>

                  <span className="qty-number">
                    {item.quantity}
                  </span>

                  <button
                    className="qty-btn"
                    onClick={() =>
                      updateQuantity(item._id, "increase")
                    }
                  >
                    +
                  </button>

                </div>

                <h3>Total: ₹{item.total}</h3>

                <button
                  className="remove-btn"
                  onClick={() => deleteItem(item._id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          {/* FINAL TOTAL */}
          <div className="final-total">

            <h2>
              Grand Total: ₹{totalPrice}
            </h2>

          </div>
        <button
  className="cart-buy-btn"
  onClick={() => setShowPayment(true)}
>
  Buy Now 🛍️
</button>
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
        onClick={() => {
          alert(`Order Placed ✅
Payment: ${selectedPayment}`);
          setShowPayment(false);
        }}
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
          alert("Payment Successful ✅");
          setShowUPI(false);
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
        </>
      )}

    </div>
  );
}