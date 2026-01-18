import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OurPolicy from '../src/components/OurPolicy'
import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'
import { ProductSkeleton } from './components/Skeleton'
import { backEndURL } from './config'

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Cart = lazy(() => import('./pages/Cart'));
const Orders = lazy(() => import('./pages/Orders'));
const Product = lazy(() => import('./pages/Product'));
const SignIn = lazy(() => import('./pages/SignIn'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Lend = lazy(() => import('./pages/Lend'));
const Earning = lazy(() => import('./pages/Earning'));
const Profile = lazy(() => import('./pages/Profile'));
const MyProducts = lazy(() => import('./pages/MyProducts'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const BecomeSeller = lazy(() => import('./pages/BecomeSeller'));
const SellerOrders = lazy(() => import('./pages/SellerOrders'));

const currency = "₹"

const App = () => {

  const [token] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : ''); // State to handle login token
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div className='px-0 min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200'>
      <NavBar />
      <SearchBar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        toastId="unique-toast"
      />

      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="container-custom py-20"><ProductSkeleton /></div>}>
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<PageTransition><Home /></PageTransition>} />
            <Route path='/collection' element={<PageTransition><Collection /></PageTransition>} />
            <Route path='/lend' element={<PageTransition><Lend /></PageTransition>} />
            <Route path='/about' element={<PageTransition><About /></PageTransition>} />
            <Route path='/contact' element={<PageTransition><Contact /></PageTransition>} />
            <Route path='/cart' element={<PageTransition><Cart /></PageTransition>} />
            <Route path='/orders' element={<PageTransition><Orders /></PageTransition>} />
            <Route path='/profile' element={<PageTransition><Profile /></PageTransition>} />
            <Route path='/earning' element={<PageTransition><Earning /></PageTransition>} />
            <Route path='/product/:productId' element={<PageTransition><Product /></PageTransition>} />
            <Route path='/login' element={<PageTransition><SignIn /></PageTransition>} />
            <Route path='/ourPolicy' element={<PageTransition><OurPolicy /></PageTransition>} />
            <Route path='/placeorder' element={<PageTransition><PlaceOrder /></PageTransition>} />
            <Route path='/myProducts' element={<PageTransition><MyProducts /></PageTransition>} />
            <Route path='/wishlist' element={<PageTransition><Wishlist /></PageTransition>} />
            <Route path='/become-seller' element={<PageTransition><BecomeSeller /></PageTransition>} />
            <Route path='/seller-orders' element={<PageTransition><SellerOrders /></PageTransition>} />
          </Routes>
        </Suspense>
      </AnimatePresence>


      <Footer />

    </div>
  )
}

export default App
