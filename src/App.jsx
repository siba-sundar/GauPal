import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import KYC from './pages/auth/KYC';
import ProductList from './pages/products/ProductList';
import ComingSoon from './pages/ComingSoon';

const App = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/kyc" element={<KYC />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>
    </Router>
  </Provider>
);

export default App;