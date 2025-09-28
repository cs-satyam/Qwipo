import React from 'react';
import Card from './Card';

const Reports = () => {
  return (
    <div className="container-fluid py-4">
      <Card title="Reports & Exports" headerRight={<button className="btn btn-outline-primary btn-sm">New Report</button>}>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-semibold mb-1">Sales Summary</h6>
              <div className="text-muted small mb-3">Weekly, Monthly, Custom</div>
              <button className="btn btn-sm btn-primary me-2">Download CSV</button>
              <button className="btn btn-sm btn-outline-secondary">Download PDF</button>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-semibold mb-1">Demand Forecast</h6>
              <div className="text-muted small mb-3">SKU-level projections</div>
              <button className="btn btn-sm btn-primary me-2">Export XLSX</button>
              <button className="btn btn-sm btn-outline-secondary">Schedule</button>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="border rounded-3 p-3 h-100">
              <h6 className="fw-semibold mb-1">Retailer Performance</h6>
              <div className="text-muted small mb-3">Cohorts, retention, AOV</div>
              <button className="btn btn-sm btn-primary me-2">Download CSV</button>
              <button className="btn btn-sm btn-outline-secondary">Email</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
