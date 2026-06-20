import React from 'react';

export default function AdminOverview() {
  return (
    <div>
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span>Active Rides</span>
            <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-primary)' }}>directions_car</span>
          </div>
          <div className="admin-metric-value">124</div>
          <div className="admin-metric-trend positive">+12% from last hour</div>
        </div>
        
        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span>Total Earnings (Today)</span>
            <span className="material-symbols-outlined" style={{ color: '#4CAF50' }}>payments</span>
          </div>
          <div className="admin-metric-value">EGP 45,200</div>
          <div className="admin-metric-trend positive">+8% from yesterday</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span>Online Drivers</span>
            <span className="material-symbols-outlined" style={{ color: '#2196F3' }}>person</span>
          </div>
          <div className="admin-metric-value">85</div>
          <div className="admin-metric-trend negative">-3% from last hour</div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-header">
            <span>Pending KYC</span>
            <span className="material-symbols-outlined" style={{ color: '#FF9800' }}>verified</span>
          </div>
          <div className="admin-metric-value">12</div>
          <div className="admin-metric-trend negative">Requires attention</div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h3>Recent Rides</h3>
          <button className="m3-btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>View All</button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Rider</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#TRX-8921</td>
              <td>Sarah Connor</td>
              <td>Ahmed Ali (Elite)</td>
              <td><span className="admin-badge success">Completed</span></td>
              <td>EGP 240</td>
            </tr>
            <tr>
              <td>#TRX-8922</td>
              <td>John Doe</td>
              <td>Mahmoud S. (Standard)</td>
              <td><span className="admin-badge info">In Progress</span></td>
              <td>EGP 150</td>
            </tr>
            <tr>
              <td>#TRX-8923</td>
              <td>Laila M.</td>
              <td>Fatma R. (Women Only)</td>
              <td><span className="admin-badge warning">Searching</span></td>
              <td>EGP 85</td>
            </tr>
            <tr>
              <td>#TRX-8924</td>
              <td>Omar K.</td>
              <td>N/A</td>
              <td><span className="admin-badge warning">Pending</span></td>
              <td>EGP 320</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
