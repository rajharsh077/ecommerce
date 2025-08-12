import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { name } = useParams();
  const [cart, setCart] = useState([]);
  const [discountMessage, setDiscountMessage] = useState("");
  const [finalAmount, setFinalAmount] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.post("http://localhost:3000/getCart", { name });
        if (res.status === 200) {
          setCart(res.data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchCart();
  }, [name]);

  const updateCartItem = async (productId, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      let updatedCart;
      if (newQuantity === 0) {
        updatedCart = cart.filter(item => item.productId !== productId);
      } else {
        updatedCart = cart.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
      }
      setCart(updatedCart);

      await axios.post("http://localhost:3000/updateCart", { name, productId, quantity: newQuantity });
    } catch (error) {
      console.error("Failed to update cart", error);
      alert("Failed to update cart");
    }
  };

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount rules in dollars
  const discountRules = [
    { min: 1000, percent: 10 },
    { min: 2000, percent: 15 },
    { min: 5000, percent: 20 },
  ];

  const applyDiscount = () => {
    let appliedRule = null;
    for (let i = discountRules.length - 1; i >= 0; i--) {
      if (totalAmount > discountRules[i].min) {
        appliedRule = discountRules[i];
        break;
      }
    }
    if (appliedRule) {
      const discount = (totalAmount * appliedRule.percent) / 100;
      const final = totalAmount - discount;
      setFinalAmount(final);
      setDiscountMessage(
        `Discount applied! Since amount > $${appliedRule.min}, ${appliedRule.percent}% off applied.`
      );
    } else {
      setFinalAmount(totalAmount);
      setDiscountMessage("No discount applied.");
    }
  };

  const handlePayNow = () => {
    alert(`Total amount to pay: ₨${(finalAmount ?? totalAmount).toFixed(2)}`);
    // TODO: Connect with payment gateway here
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">Hi {name}</h1>
      <h2 className="text-xl font-medium mb-4">Here is your cart:</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {cart.map((item, idx) => (
              <div key={idx} className="border p-4 rounded flex items-center justify-between space-x-4">
                <div>
                  <p className="font-semibold">{item.name || item.productId}</p>
                  <p>Price: ₨{item.price}</p>
                  <p>Total: ₨{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Discount */}
          <div className="text-right mb-4">
            <p className="text-xl font-bold mb-2">
              Total: <span className="text-green-600">₨{totalAmount.toFixed(2)}</span>
            </p>
            <button
              onClick={applyDiscount}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Apply Discount
            </button>
            {discountMessage && (
              <p className="mt-2 text-sm text-gray-700">{discountMessage}</p>
            )}
            {finalAmount !== null && (
              <p className="mt-1 text-lg font-semibold">
                Final Amount: <span className="text-blue-600">₨{finalAmount.toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Pay Button */}
          <div className="text-right">
            <button
              onClick={handlePayNow}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Pay Now
            </button>
          </div>

          {/* Footer - Discount Description */}
          <div className="mt-8 border-t pt-4 text-sm text-gray-600">
            <p>💡 Discount Rules:</p>
            <ul className="list-disc ml-5">
              {discountRules.map((rule, idx) => (
                <li key={idx}>Above ₨{rule.min} → {rule.percent}% discount</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
