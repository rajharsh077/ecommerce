import React from 'react'
import { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
const Order = () => {
    const {name}=useParams();
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
       const fetchOrders=async()=>{
        const res=await axios.get(`http://localhost:3000/${name}/orders`);
        setOrders(res.data);
       }
       fetchOrders();
    },[name])
    
  return (
    <>
        <div>
      <h1>{name}'s Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Date</th>
              <th>Delivery Partner</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>{order.deliveryPartner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  )
}

export default Order
