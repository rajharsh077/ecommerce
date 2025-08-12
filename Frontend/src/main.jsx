import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter, 
  RouterProvider,
} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import Layout from './components/Layout.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Params from './components/Params.jsx';
import Cart from './components/Cart.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children:[
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Signup />,
      },
      {
        path: ":name",
        element: <Params />,
      },
      {
        path: ":name/cart",
        element: <Cart />,
      },


    ]

    
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
