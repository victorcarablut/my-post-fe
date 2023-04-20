import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/security/PrivateRoute';

// Components
import Home from './components/Home';

import Header from './components/Header';
import Footer from './components/Footer';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyCode from './components/auth/VerifyCode';

import Private from './components/other/Private';
import About from './components/other/About';
import Contact from './components/other/Contact';
import PrivacyPolicy from './components/other/PrivacyPolicy';

// account
import UserDetails from './components/account/UserDetails';
import UserProfile from './components/account/UserProfile';

// admin
import Dashboard from './components/admin/Dashboard';

import NotFound from './components/other/NotFound';

// Notifications
import { Toaster } from 'react-hot-toast';




function App() {
  return (
    <div>
      <Router>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Header />
        <main>
          <Routes>

            {/* public */}
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/code/verify" exact element={<VerifyCode />} />

            {/* private */}
            <Route element={<PrivateRoute />}>
              <Route path="/" exact element={<Home />} />
              <Route path="/private" element={<Private />} />
              <Route path="/account" element={<UserDetails />} />
              <Route path="/user/:username" element={<UserProfile />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Route>

            {/* public */}
            <Route path="/about" exact element={<About />} />
            <Route path="/contact" exact element={<Contact />} />
            <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />

            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
