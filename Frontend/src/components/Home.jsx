import React from 'react'
import { useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
const Home = () => {
    const navigate=useNavigate();
    const [products, setproducts] = useState([])
    useEffect(()=>{
       const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/getproducts');
        setproducts(res.data); 
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
    },[])

     const goToLogin = () => {
    navigate('/login'); 
  };
  return (
    <>

    <Navbar />
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.productId} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-4 rounded" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-indigo-600 font-bold mt-2">₨{product.price.toFixed(2)}</p>
            <button onClick={goToLogin} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
    
  )
}

export default Home
