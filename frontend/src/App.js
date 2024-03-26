// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/authContext';
import SignInModal from './Components/Modals/SignInModal';
import SignUpModal from './Components/Modals/SignUpModal';
import Profile from './Components/Profile';
import Home from './Components/Home';
import Contact from './Components/Contact';
import About from './Components/About';
import Donate from './Components/Donate';
import Market from './Components/Market';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

function App() {
  return (
    <AuthProvider>
  <Router>
      <Navbar></Navbar>
    <Routes>
      <Route path="/signin" element={<SignInModal />} />
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<SignUpModal />} />
      <Route path="/profile" element={<Profile/> } />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/market" element={<Market />} />
      {/* Add other routes as needed
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
    <Footer/>
  </Router>
</AuthProvider>

  );
}

export default App;
