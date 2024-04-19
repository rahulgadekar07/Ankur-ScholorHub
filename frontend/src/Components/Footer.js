import React from 'react'
import "../Styles/Footer.css"
import { useLocation } from 'react-router-dom'
const Footer = () => {
  const location=useLocation();
  const footerStyle = {
    backgroundColor: location.pathname === '/admindash' ? 'darkblue' : 'rgb(87, 70, 181)',
    
   
  };

  return (
    <footer className=' footer1' style={footerStyle}>
     <p className='m-0 '>&copy; {new Date().getFullYear()} Ankur Vidyarthi Foundation</p>

    </footer>
  )
}

export default Footer
