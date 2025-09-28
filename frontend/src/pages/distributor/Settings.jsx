import React from 'react';
import Card from './Card';

const Settings = () => {
  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <Card title="Profile">
            <form className="row g-3">
              <div className="col-12">
                <label className="form-label">Company Name</label>
                <input className="form-control" defaultValue="Acme Distribution Pvt Ltd" />
              </div>
              <div className="col-6">
                <label className="form-label">Owner</label>
                <input className="form-control" defaultValue="Ravi Kumar" />
              </div>
              <div className="col-6">
                <label className="form-label">Contact</label>
                <input className="form-control" defaultValue="+91 98765 43210" />
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="2" defaultValue={`#22, 2nd Cross, Indiranagar, Bengaluru`}></textarea>
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button type="button" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </Card>
        </div>
        <div className="col-12 col-lg-6">
          <Card title="Notifications">
            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" id="notif1" defaultChecked />
              <label className="form-check-label" htmlFor="notif1">Email alerts for low stock</label>
            </div>
            <div className="form-check form-switch mb-2">
              <input className="form-check-input" type="checkbox" id="notif2" defaultChecked />
              <label className="form-check-label" htmlFor="notif2">WhatsApp alerts for inactive retailers</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="notif3" />
              <label className="form-check-label" htmlFor="notif3">Weekly performance summary</label>
            </div>
            <button type="button" className="btn btn-outline-secondary">Update Preferences</button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
