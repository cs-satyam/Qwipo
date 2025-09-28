import React from 'react';
import Card from './Card';

const KPI = ({ icon, label, value, trend, trendType = 'up' }) => (
  <div className="col-6 col-md-3">
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
  </div>
);

const Alerts = () => (
  <Card title="Alerts" className="mt-3">
    <ul className="list-group list-group-flush">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Low stock: Aashirvaad Atta 10kg
        <span className="badge text-bg-danger rounded-pill">12 left</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Retailer inactive: Fresh Mart
        <span className="badge text-bg-warning rounded-pill">7 days</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        High demand: Cold Brew Coffee
        <span className="badge text-bg-success rounded-pill">+22%</span>
      </li>
    </ul>
  </Card>
);

const Home = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row g-3 g-md-4">
        <KPI icon="💰" label="This Week Sales" value="₹4,85,200" trend="+6%" />
        <KPI icon="📦" label="Open Orders" value="32" trend="+4" />
        <KPI icon="📈" label="Growth (MoM)" value="12%" trend="+2%" />
        <KPI icon="⚠️" label="Low-Stock SKUs" value="9" trend="-3" trendType="down" />
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-8">
          <Card title="Quick Sales Summary">
            <div className="row text-center">
              <div className="col-6 col-md-3">
                <div className="small text-muted">Orders</div>
                <div className="h4 fw-bold">128</div>
              </div>
              <div className="col-6 col-md-3">
                <div className="small text-muted">Avg Order Value</div>
                <div className="h4 fw-bold">₹3,790</div>
              </div>
              <div className="col-6 col-md-3 mt-3 mt-md-0">
                <div className="small text-muted">Top Category</div>
                <div className="h4 fw-bold">Beverages</div>
              </div>
              <div className="col-6 col-md-3 mt-3 mt-md-0">
                <div className="small text-muted">Returns</div>
                <div className="h4 fw-bold">1.8%</div>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-12 col-lg-4">
          <Alerts />
        </div>
      </div>
    </div>
  );
};

export default Home;
