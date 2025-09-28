import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar1 = ({
  categories = [],
  selectedCategory = '',
  minPrice = '',
  maxPrice = '',
  onChange = () => {},
  onApply = () => {},
  onReset = () => {},
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <aside className="dashboard-sidebar bg-body-tertiary border-end">
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-sliders2-vertical me-2 text-primary"></i>
          <span className="fw-semibold text-uppercase small text-muted">Navigation</span>
        </div>
        
        {/* Toggle button */}
        <button
          className="btn btn-outline-primary w-100 mb-3 d-flex align-items-center justify-content-center"
          onClick={() => setShowFilters(v => !v)}
          aria-expanded={showFilters}
          aria-controls="sidebar-filters"
        >
          <i className="bi bi-funnel me-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Filters */}
        <div id="sidebar-filters" className={showFilters ? 'card' : 'card d-none'}>
          <div className="card-header py-2">
            <strong>Filters</strong>
          </div>
          <div className="card-body d-grid gap-3">
            {/* Category */}
            <div>
              <label className="form-label small text-muted">Category</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => onChange({ field: 'category', value: e.target.value })}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="form-label small text-muted">Price range (₹)</label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => onChange({ field: 'minPrice', value: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => onChange({ field: 'maxPrice', value: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary w-50" onClick={onReset}>Reset</button>
              <button className="btn btn-primary w-50" onClick={onApply}><i className="bi bi-funnel me-1"/>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar1;

