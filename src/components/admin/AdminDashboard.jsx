import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import '../../admin.css';

export default function AdminDashboard() {
  const location = useLocation();

  const getHeaderTitle = () => {
    if (location.pathname.includes('/users')) return 'User Management';
    if (location.pathname.includes('/drivers')) return 'Driver Management';
    if (location.pathname.includes('/rides')) return 'Ride History';
    return 'Platform Overview';
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>admin_panel_settings</span>
          </div>
          <h2>AVEC Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin" className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            <span className="material-symbols-outlined">dashboard</span>
            Overview
          </Link>
          <Link to="/admin/rides" className={`admin-nav-link ${location.pathname.includes('/admin/rides') ? 'active' : ''}`}>
            <span className="material-symbols-outlined">route</span>
            Rides
          </Link>
          <Link to="/admin/users" className={`admin-nav-link ${location.pathname.includes('/admin/users') ? 'active' : ''}`}>
            <span className="material-symbols-outlined">group</span>
            Users
          </Link>
          <Link to="/admin/drivers" className={`admin-nav-link ${location.pathname.includes('/admin/drivers') ? 'active' : ''}`}>
            <span className="material-symbols-outlined">badge</span>
            Drivers
          </Link>
        </nav>
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: '16px' }}>
          <Link to="/" className="m3-btn btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--md-sys-color-on-surface-variant)', textDecoration: 'none' }}>
            <span className="material-symbols-outlined">logout</span>
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-title">{getHeaderTitle()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--md-sys-color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--md-sys-color-on-primary-container)', fontWeight: 600 }}>
                A
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Admin User</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/rides" element={<div style={{ padding: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}>Ride History Component coming soon...</div>} />
            <Route path="/users" element={<div style={{ padding: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}>User Management Component coming soon...</div>} />
            <Route path="/drivers" element={<div style={{ padding: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}>Driver Management Component coming soon...</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
