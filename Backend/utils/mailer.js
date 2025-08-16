const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmationEmail = async (to, name, items) => {
  const productList = items.map(item =>
    `<li>${item.name} x ${item.quantity} - ₹${item.price}</li>`
  ).join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Order Confirmation - Thank you for your purchase!",
    html: `
      <h2>Hello ${name},</h2>
      <p>Your order has been placed successfully. Here are the details:</p>
      <ul>${productList}</ul>
      <p>We’ll notify you when your order is out for delivery.</p>
      <br/>
      <p>– The Team of ShopEase</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };
