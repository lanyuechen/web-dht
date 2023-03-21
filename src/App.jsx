import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import '@arco-design/web-react/dist/css/arco.min.css';
import './index.css';

import Home from '@/pages/Home';
import SubApp from '@/pages/SubApp';

export default () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home />} />
          <Route path="/:id" element={<SubApp />} />
        </Route>
      </Routes>
    </Router>
  )
}
