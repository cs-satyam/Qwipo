import React from 'react';
import Card from './Card';

const Promotions = () => {
  return (
    <div className="container-fluid py-4">
      <Card title="Push New Deals & Offers" headerRight={<button className="btn btn-primary btn-sm">Create Promotion</button>}>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-4">
            <div className="alert alert-primary">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Festive Combo Pack</strong>
                <span className="badge text-bg-primary">Active</span>
              </div>
              <div className="small text-muted">Extra 10% on Beverages + Snacks</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="alert alert-warning">
              <div className="d-flex justify-content-between align-items-center">
                <strong>Staples Saver</strong>
                <span className="badge text-bg-warning">Draft</span>
              </div>
              <div className="small text-muted">Bulk flour + oil bundle</div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-xl-4">
            <div className="alert alert-success">
              <div className="d-flex justify-content-between align-items-center">
                <strong>New Retailer Welcome</strong>
                <span className="badge text-bg-success">Active</span>
              </div>
              <div className="small text-muted">5% off first 3 orders</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Promotions;
