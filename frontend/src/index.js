import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import Navbar from './layouts/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Router>
  <Routes>
    <Route path='/' element={<><Navbar /> <Home /></>} />
    <Route path='/admin' element={<><Admin /></>} />
    <Route path='/*' element={<><Navbar /> <Home /></>} />
  </Routes>

</Router>
);
