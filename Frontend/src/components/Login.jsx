import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,           
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
     const res=await axios.post("http://localhost:3000/login",formData);
     alert(res.data.message);
     if(res.status==200){
         navigate(`/${res.data.name}`);
     }
     else{
        alert(res.data.message);
     }
   } catch (error) {
    console.log("error",error);
    alert("Login failed. Please try again.");
   }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium" htmlFor="email">Email:</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            value={formData.email} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="password">Password:</label>
          <input 
            type="password" 
            name="password" 
            id="password"
            value={formData.password} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
