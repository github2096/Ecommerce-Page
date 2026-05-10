const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

/* =========================
   MULTER CONFIG (ONLY ONCE)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");   // make sure folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* =========================
   CONNECT MONGODB
========================= */
mongoose.connect(
  "mongodb://shravnigavli279:shrawani209@ac-uu56fyq-shard-00-00.5xt9ct5.mongodb.net:27017,ac-uu56fyq-shard-00-01.5xt9ct5.mongodb.net:27017,ac-uu56fyq-shard-00-02.5xt9ct5.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-uoyoin-shard-0&authSource=admin&retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

/* =========================
   SCHEMAS
========================= */

// PRODUCT
const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  desc: String
}));

// CART
const Cart = mongoose.model("Cart", new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1 },
  total: Number
}));

// ORDER
const Order = mongoose.model("Order", new mongoose.Schema({
  items: Array,
  totalAmount: Number,
  paymentMode: String,
  createdAt: { type: Date, default: Date.now }
}));

/* =========================
   PRODUCT APIs
========================= */

// ADD PRODUCT
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      
      image: req.file
        ? "http://localhost:5000/uploads/" + req.file.filename
        : ""
    });

    await product.save();

    res.json({ message: "Product added ✅", product });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET PRODUCTS
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* =========================
   CART APIs
========================= */

// ADD TO CART
app.post("/api/cart", async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.json({ message: "Product not found ❌" });
    }

    const existing = await Cart.findOne({ productId });

    if (existing) {
      existing.quantity += 1;
      existing.total = existing.price * existing.quantity;
      await existing.save();
    } else {
      await Cart.create({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        total: product.price
      });
    }

    const cart = await Cart.find();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET CART
app.get("/api/cart", async (req, res) => {
  const cart = await Cart.find();
  res.json(cart);
});

/* UPDATE QUANTITY */
app.put("/api/cart/:id", async (req, res) => {

  const { action } = req.body;

  const item = await Cart.findById(req.params.id);

  if (!item) {
    return res.json({ message: "Item not found ❌" });
  }

  // INCREASE
  if (action === "increase") {
    item.quantity += 1;
  }

  // DECREASE
  if (action === "decrease") {

    if (item.quantity > 1) {
      item.quantity -= 1;
    }

  }

  // UPDATE TOTAL
  item.total = item.price * item.quantity;

  await item.save();

  res.json(item);

});
// DELETE CART ITEM
app.delete("/api/cart/:id", async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed ❌" });
});

/* =========================
   ORDER APIs
========================= */

// BUY NOW
app.post("/api/buy", async (req, res) => {
  try {
    const cartItems = await Cart.find();

    if (cartItems.length === 0) {
      return res.json({ message: "Cart is empty ❌" });
    }

    let total = 0;
    cartItems.forEach(item => total += item.total);

    await Order.create({
      items: cartItems,
      totalAmount: total,
      paymentMode: "Cash on Delivery"
    });

    await Cart.deleteMany({});

    res.json({
      message: "Order placed ✅",
      totalAmount: total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});