import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Gaming from '../pages/Gaming';


const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/gaming' element={<Gaming />} />
    </Routes>
  );
};

export default AllRoutes;
