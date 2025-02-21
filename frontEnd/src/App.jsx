import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Product from './pages/Product'
import SignIn from './pages/SignIn'
import PlaceOrder from './pages/PlaceOrder'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Lend from './pages/Lend'
import Earning from './pages/Earning'
import Profile from './pages/Profile'
import GoogleLend from './pages/GoogleLend'
import OurPolicy from './pages/OurPolicy'
import MyProducts from './pages/MyProducts'


export const backEndURL = import.meta.env.VITE_BACKEND_URL
const currency = "₹"

const App = () => {

  const [token] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : ''); // State to handle login token

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='px-0'>
      <NavBar />
      <SearchBar />
      <ToastContainer />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/lend' element={<Lend token={token} />} />
        <Route path='/product_for_rent' element={<GoogleLend/>}/>
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/my_earning' element={<Earning/>} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/ourPolicy' element={<OurPolicy/>}/>
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/myProducts' element={<MyProducts/>}/>
      </Routes>
      

      <Footer />
   
    </div>
  )
}

export default App
