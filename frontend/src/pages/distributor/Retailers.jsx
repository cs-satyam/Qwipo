import React from 'react';
import Card from './Card';

const Retailers = () => {
  const retailers = [
    { name: 'Fresh Mart', status: 'Inactive', days: 7 },
    { name: 'City Grocers', status: 'Active', days: 0 },
    { name: 'Green Basket', status: 'Active', days: 0 },
    { name: 'Daily Needs', status: 'Inactive', days: 12 },
  ];

  return (
    <div className="container-fluid py-4">
      <Card title="Retailers">
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th className="ps-3">Retailer</th>
                <th>Status</th>
                <th>Last Order</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {retailers.map((r) => (
                <tr key={r.name}>
                  <td className="ps-3 fw-semibold">{r.name}</td>
                  <td>
                    <span className={`badge rounded-pill ${r.status === 'Active' ? 'text-bg-success' : 'text-bg-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>{r.status === 'Active' ? '2 days ago' : `${r.days} days`}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-primary me-2">View</button>
                    <button className="btn btn-sm btn-primary">Nudge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Retailers;
