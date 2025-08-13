const express = require('express');
require('dotenv').config();
const router = express.Router();
const Razorpay = require('razorpay');
const userModel=require("../models/users");
const crypto = require("crypto");

const deliveryPartners = ["Ravi", "Anita", "John", "Priya", "Amit"];



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

router.post("/checkout", async (req, res) => {
  const { finalAmount } = req.body;

  if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
    return res.status(400).json({ message: "Valid amount is required" });
  }

  const options = {
    amount: Math.round(Number(finalAmount) * 100), // convert to paise
    currency: "INR",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json({ message: "success", order });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
});

router.get("/getKey",(req,res)=>{
    return res.status(200).json({key:process.env.RAZORPAY_API_KEY});
})

router.post("/payment-success",async(req,res)=>{

  try {
     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name } = req.body;
     const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(sign.toString())
        .digest("hex");
  
      if (expectedSign !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }
  
  
      const user = await userModel.findOne({ name });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    user.orders.push(
        ...user.cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          deliveryPartner:deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)],
        }))
      );
  
      // Cart empty kar dena
      user.cart = [];
  
      await user.save();
  
      res.status(200).json({ message: "Payment successful, order placed" });
  } catch (error) {
        console.error("Payment success error:", error);
    res.status(500).json({ message: "Server error" });
  }


})
module.exports = router;
