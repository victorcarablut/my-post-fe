import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global Style CSS
import './assets/css/index.css';

// Bootstrap (Default CSS)
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap (Custom CSS)
import './assets/css/custom-bootstrap.css';

// Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css';

// Animate CSS
import 'animate.css';

// Balloon CSS (Tooltips)
import 'balloon-css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);
