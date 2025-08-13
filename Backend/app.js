const express=require('express');
const app=express();
app.use(express.json());
const cors=require('cors');
app.use(cors());
require('dotenv').config();
const userModel=require("./models/users");
const bcrypt=require('bcrypt');
const products=require("./data/products");
const dbConnection=require("./config/db");
app.use(express.urlencoded({extended:true}));


const paymentRoute=require("./routes/paymentroutes");

app.use("/api",paymentRoute);

dbConnection();

const key=process.env.RAZORPAY_API_KEY;
const secret=process.env.RAZORPAY_API_SECRET;




const port=process.env.PORT;

app.get("/",(req,res)=>{
    res.send("Hii");
})

app.get("/getproducts",(req,res)=>{
    res.json(products);
})
app.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return res.status(500).json({ message: "Server error" });

    bcrypt.hash(password, salt, async function(err, hash) {
      if (err) return res.status(500).json({ message: "Server error" });

      try {
        const user = await userModel.create({
          name,
          email,
          phone,
          password: hash,
          cart: [],
          orders: []
        });
        return res.status(201).json({ message: "Signup successful", user });
      } catch (error) {
        console.log("Failed to register..");
        return res.status(500).json({ message: "Signup failed", error: error.message });
      }
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Both fields required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!result) {
        return res.status(401).json({ message: "Wrong password" });
      }
      return res.status(200).json({ message: "Login successful", name: user.name });
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/cart", async (req, res) => {
  const { name, product, quantity } = req.body;

  if (!name || !product || !quantity) {
    return res.status(400).json({ message: "Name, product and quantity required" });
  }

  const quantityInt = parseInt(quantity);
  if (isNaN(quantityInt) || quantityInt <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" });
  }

  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingProductIndex >= 0) {
      user.cart[existingProductIndex].quantity += quantityInt;
    } else {
      user.cart.push({
      productId: product.productId,
    name: product.name,
      price: product.price,
      quantity: quantityInt,
  });
    }

    await user.save();

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/getUser",async (req,res)=>{
  const { name } = req.query; 
   try {
    const user = await userModel.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
})


app.post("/getCart", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/updateCart", async (req, res) => {
  const { name, productId, quantity } = req.body;

  if (!name || !productId || quantity == null) {
    return res.status(400).json({ message: "Name, productId and quantity are required" });
  }

  const quantityInt = parseInt(quantity);
  if (isNaN(quantityInt) || quantityInt < 0) {
    return res.status(400).json({ message: "Quantity must be a non-negative integer" });
  }

  try {
    const user = await userModel.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (quantityInt === 0) {
      // Remove product from cart
      user.cart.splice(existingProductIndex, 1);
    } else {
      // Update quantity
      user.cart[existingProductIndex].quantity = quantityInt;
    }

    await user.save();

    return res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});



app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
})


