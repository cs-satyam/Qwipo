import React from 'react';
import Card from './Card';

const Sales = () => {
  const topCategories = [
    { name: 'Beverages', share: '28%' },
    { name: 'Staples', share: '22%' },
    { name: 'Snacks', share: '16%' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <Card title="This Week vs Last">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">This Week</div>
                <div className="display-6 fw-bold text-primary">₹4.85L</div>
              </div>
              <div className="text-success fw-semibold">+6%</div>
            </div>
            <hr />
            <div className="text-muted small">Conversion Rate</div>
            <div className="h4 fw-bold">3.2%</div>
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card title="Top Categories">
            <ul className="list-group list-group-flush">
              {topCategories.map((c) => (
                <li key={c.name} className="list-group-item d-flex justify-content-between">
                  <span>{c.name}</span>
                  <span className="fw-semibold">{c.share}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <div className="col-12 col-xl-4">
          <Card title="Growth Stats">
            <div className="row text-center">
              <div className="col-4">
                <div className="small text-muted">MoM</div>
                <div className="h5 fw-bold text-success">+12%</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">QoQ</div>
                <div className="h5 fw-bold text-success">+8%</div>
              </div>
              <div className="col-4">
                <div className="small text-muted">YoY</div>
                <div className="h5 fw-bold text-success">+18%</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;
