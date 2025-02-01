import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Online from '../pages/Online';
import Mode from '../pages/Mode';
import Computer from '../pages/Computer';


const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/online' element={<Online />} />
      <Route path='/mode' element={<Mode />} />
      <Route path='/computer' element={<Computer />} />
    </Routes>
  );
};

export default AllRoutes;
