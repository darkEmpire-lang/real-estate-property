import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
// import Contact from './pages/Contact'
// import About from './pages/About'
import Cart from './pages/Cart'
import Order from './pages/Order'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import Verify from './pages/Verify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AdminNavbar from './components/AdminNavbar'
import TicketRaisePage from './pages/TicketRaisePage'
import MyTickets from './pages/MyTickets'
import FeedbackPage from './pages/FeedbackPage'
import MyFeedbacks from './pages/MyFeedbacks'
import AllFeedbacks from './pages/AllFeedbacks'
import AddProperty from './pages/AddProperty'
import PropertyList from './pages/PropertyList'
import UserPropList from './pages/UserPropList'
import BookAppointment from './pages/BookAppointment'
import ProfilePage from './pages/ProfilePage'
import MyBookings from './pages/MyBookings'

const App = () => {
  const location = useLocation()

  console.log(location.pathname) // Debugging the pathname

  return (
    <div className='px-4 sm:px-[5vw] md:px [7vw] lg:px-[9vw ]'>
      <ToastContainer />
      
      {/* Render AdminNavbar for admin-related pages */}
      {location.pathname.includes('/orders') || location.pathname.includes('/admin') ? (
        <AdminNavbar />
      ) : (
        <Navbar />
      )}

      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/Place-order' element={<PlaceOrder />} />
        <Route path='/product/:productId' element={<Product />} />
        {/* <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} /> */}
        <Route path='/verify' element={<Verify />} />
        <Route path='/raise-ticket' element={<TicketRaisePage />} />
        <Route path='/my-tickets' element={<MyTickets />} />
        <Route path='/submit-feedbacks' element={<FeedbackPage />} />
        <Route path='/my-feedbacks' element={<MyFeedbacks />} />
        <Route path='/feedbacks' element={<AllFeedbacks />} />
        <Route path='/add-prop' element={<AddProperty />} />
        <Route path='/properties' element={<PropertyList />} />
         <Route path='/user-prop' element={<UserPropList />} /> 
        <Route path='/book/:id' element={<BookAppointment />} />
        <Route path='/book' element={<MyBookings />} />
        <Route path='/profile' element={<ProfilePage />} />



        {/* <Route path='/profile' element={<ProfilePage />} /> */}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
