import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PrivateRoute from './components/security/PrivateRoute';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VerifyCode from './components/auth/VerifyCode';

import Home from './components/Home';
import Private from './components/other/Private';
import About from './components/other/About';

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
          <div className="container-fluid">
            <Routes>

              {/* public */}
              <Route path="/" exact element={<Home />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/register" exact element={<Register />} />
              <Route path="/code/verify" exact element={<VerifyCode />} />
              {/* private */}
              <Route element={<PrivateRoute />}>
                <Route path="/private" element={<Private />} />
              </Route>

              {/* public */}
              <Route path="/about" exact element={<About />} />
              <Route path="*" element={<NotFound />} />

            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
