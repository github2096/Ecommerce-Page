import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <h2 className="logo">
        ShopEasy
      </h2>

      {/* MENU */}
      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/cart">
          Cart
        </Link>

      

        <Link to="/add">
          Add Product
        </Link>

      </div>

    </nav>
  );
}