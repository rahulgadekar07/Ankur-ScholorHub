import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Contexts/authContext";
import SignInModal from "./Components/Modals/SignInModal";
import SignUpModal from "./Components/Modals/SignUpModal";
import Profile from "./Components/Profile";
import Home from "./Components/Home";
import Contact from "./Components/Contact";
import About from "./Components/About";
import Donate from "./Components/Donate";
import Market from "./Components/Market";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Formpage from "./Components/Scholorship/Formpage";
import PersonalDetails from "./Components/Scholorship/PersonalDetails";
import IncomeDetails from "./Components/Scholorship/IncomeDetails";
import EducationDetails from "./Components/Scholorship/EducationDetails";
import AddressDetails from "./Components/Scholorship/AddressDetails";
import ApplicationForm from "./Components/Scholorship/ApplicationForm";
import AdminDash from "./Components/Administrator/AdminDash";
import AdminLogin from "./Components/Administrator/AdminLogin";
import AdminSignup from "./Components/Administrator/AdminSignUp";
import { AdminAuthProvider } from "./Contexts/AdminAuthContext";
import SendEmail from "./Components/Administrator/SendEmail";
import AdminApplicationForm from "./Components/Administrator/AdminApplicationForm";
import DisplayQuiz from "./Components/Quiz/DisplayQuiz";
import AddItem from "./Components/SalesItems/AddItem";
import MyProducts from "./Components/SalesItems/MyProducts";
import NewsStrip from "./Components/Alerts/NewsStrip";
import DisplayQuizResults from "./Components/Quiz/DisplayQuizResults";
import { NewsStripProvider } from "./Contexts/NewsStripContext";
import RequestResetPassword from "./Components/Modals/RequestResetPassword";
import VerifyAndResetPassword from "./Components/Modals/VerifyAndResetPassword";

function App() {
  return (
    <NewsStripProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <NewsStrip />
          <Routes>
            <Route path="/signin" element={<SignInModal />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUpModal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/market" element={<Market />} />
            <Route path="/apply" element={<Formpage />} />
            <Route path="/printform" element={<ApplicationForm />} />
            <Route path="/personal-details" element={<PersonalDetails />} />
            <Route path="/address-details" element={<AddressDetails />} />
            <Route path="/income-details" element={<IncomeDetails />} />
            <Route path="/education-details" element={<EducationDetails />} />
            <Route path="/additem" element={<AddItem />} />
            <Route path="/myproducts" element={<MyProducts />} />
            <Route path="/results" element={<DisplayQuizResults />} />
            <Route path="/request-reset-password" element={<RequestResetPassword/>} />
            <Route path="/verify-reset-password" element={<VerifyAndResetPassword/>} />

            <Route path="/display-quiz" element={<DisplayQuiz />} />
            <Route
              path="/admin"
              element={
                <AdminAuthProvider>
                  <AdminLogin />
                </AdminAuthProvider>
              }
            />
            <Route path="/adminsignup" element={<AdminSignup />} />
            <Route
              path="/admindash"
              element={
                <AdminAuthProvider>
                  <AdminDash />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/sendemail"
              element={
                <AdminAuthProvider>
                  <SendEmail />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/adminappform"
              element={
                <AdminAuthProvider>
                  <AdminApplicationForm />
                </AdminAuthProvider>
              }
            />
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </NewsStripProvider>
  );
}

export default App;
