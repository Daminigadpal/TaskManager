import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content" style={{ padding: '20px' }}>
        {/* This is where the pages (TaskList, Login, etc.) will render */}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;