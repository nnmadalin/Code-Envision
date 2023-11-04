import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Navbar from './layouts/Navbar';
import Home from './pages/Home';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Navbar />
    <Home />
  </React.StrictMode>
);
