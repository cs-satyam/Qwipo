import React from 'react';

const StatCard = ({ icon, label, value, trend, trendType = 'up' }) => (
  <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
    <div className="card-body d-flex align-items-center p-4">
      <div className="me-3 d-flex align-items-center justify-content-center rounded-3" style={{ width: 44, height: 44, background: '#EEF2FF' }}>
        <span className="fs-5">{icon}</span>
      </div>
      <div className="flex-grow-1">
        <div className="small text-muted mb-1">{label}</div>
        <div className="h4 mb-0 fw-bold">{value}</div>
      </div>
      {trend && (
        <span className={`badge ${trendType === 'up' ? 'text-success bg-success-subtle' : 'text-danger bg-danger-subtle'} fw-semibold rounded-pill`}>{trend}</span>
      )}
    </div>
  </div>
);

const TopStats = () => {
  return (
    <div className="row g-3 g-md-4">
      <div className="col-6 col-md-3">
        <StatCard icon="📦" label="Open Orders" value="18" trend="+3 this week" trendType="up" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="💰" label="Spend (This Week)" value="₹12,500" trend="+5% vs last" trendType="up" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="⭐" label="Fill Rate" value="97%" trend="stable" trendType="up" />
      </div>
      <div className="col-6 col-md-3">
        <StatCard icon="⚠️" label="Stock Alerts" value="4" trend="-2 today" trendType="down" />
      </div>
    </div>
  );
};

export default TopStats;
