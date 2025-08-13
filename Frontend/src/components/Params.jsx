import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Params = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [products, setProducts] = useState([]);

  // Track quantities per productId, default 1
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/getproducts');
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach(prod => {
          initialQuantities[prod.productId] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  const orderPage=()=>{
       navigate(`/${name}/orders`);
  }

  const handleQuantityChange = (productId, value) => {
    if (value < 1) return; // don't allow zero or negative
    setQuantities(prev => ({ ...prev, [productId]: value }));
  };

  const handleCartClick = async (product) => {
    const quantity = quantities[product.productId] || 1;
    try {
      const res = await axios.post("http://localhost:3000/cart", { name, product, quantity });
      alert(`Added ${quantity} x ${product.name} to cart`);
    } catch (error) {
      console.error("Failed to add to cart", error);
      alert("Failed to add to cart");
    }
  };

  // New function to go to cart page
  const goToCart = () => {
    navigate(`/${name}/cart`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Welcome, <span className="text-blue-600">{name}</span>!
      </h1>

      {/* Go to Cart Button */}
      <div className="text-center mb-6">
        <button
          onClick={goToCart}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Go to Cart
        </button>
      </div>

      <div className="text-right mb-6">
  <button onClick={orderPage}
    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
  >
    View My Orders
  </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.productId}
              className="border rounded p-4 flex flex-col items-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover mb-4"
              />
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-gray-700 font-semibold mt-2">₨{product.price}</p>

              <div className="mt-2 flex items-center space-x-2">
                <label htmlFor={`quantity-${product.productId}`} className="font-medium">
                  Qty:
                </label>
                <input
                  id={`quantity-${product.productId}`}
                  type="number"
                  min="1"
                  value={quantities[product.productId] || 1}
                  onChange={(e) => handleQuantityChange(product.productId, Number(e.target.value))}
                  className="w-16 px-2 py-1 border rounded text-center"
                />
              </div>

              <button
                onClick={() => handleCartClick(product)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">Loading products...</p>
        )}
      </div>
    </div>
  );
};


export default Params;
