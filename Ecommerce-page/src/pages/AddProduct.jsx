import { useState } from "react";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    desc: "",
    image: null
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("desc", form.desc);
    data.append("image", form.image);

    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: data
    });

    const text = await res.text();   // ✅ IMPORTANT FIX

    try {
      const result = JSON.parse(text);
      alert(result.message);
    } catch {
      alert("Server error ❌");
      console.log(text);
    }
  };

  return (
   <div className="add-page">
  <h2>Add New Product</h2>

  <form onSubmit={handleSubmit} className="form">

    <input name="name" placeholder="Product Name" onChange={handleChange} />

    <input name="price" placeholder="Price" onChange={handleChange} />

   

    <input type="file" name="image" onChange={handleChange} />

    <button type="submit">Add Product</button>

  </form>
</div>
  );
}