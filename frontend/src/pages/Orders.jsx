 
import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Modal, Button, Pagination as BootstrapPagination, Dropdown } from 'react-bootstrap';
import TopNav from './components/layout/TopNav';
import Sidebar from './components/layout/Sidebar';
import './components/css/Dashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';


// --- HELPER COMPONENTS ---

// For rendering status badges
const statusBadge = (s) => {
  const map = {
    Delivered: 'bg-success-subtle text-success',
    Processing: 'bg-primary-subtle text-primary',
    Pending: 'bg-warning-subtle text-warning',
    Cancelled: 'bg-danger-subtle text-danger',
  };
  return map[s] || 'bg-secondary-subtle text-secondary';
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="card stat-card h-100">
    <div className="card-body">
      <div className="d-flex align-items-center">
        <div className={`icon-circle me-3 bg-${color}-subtle text-${color}`}>
          <i className={`bi ${icon}`}></i>
        </div>
        <div>
          <h6 className="text-muted fw-normal mb-1">{label}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN ORDERS COMPONENT ---

function Orders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const arr = Array.isArray(res.data) ? res.data : [];
        setOrders(arr);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Filtering and Sorting Logic
  const sortedAndFilteredOrders = useMemo(() => {
    let filtered = orders.filter((o) => {
      const created = o.createdAt ? new Date(o.createdAt).toISOString().slice(0,10) : '';
      const matchQuery = `${o._id}`.toLowerCase().includes(query.trim().toLowerCase());
      const matchStatus = status === 'All' ? true : o.status === status;
      const matchDate = (dateRange.start === '' || created >= dateRange.start) && (dateRange.end === '' || created <= dateRange.end);
      return matchQuery && matchStatus && matchDate;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const get = (obj, key) => {
          if (key === 'id') return obj._id;
          if (key === 'total') return obj.totalAmount;
          if (key === 'date') return obj.createdAt;
          if (key === 'customer') return obj.retailer || '';
          return obj[key];
        };
        if (get(a, sortConfig.key) < get(b, sortConfig.key)) return sortConfig.direction === 'asc' ? -1 : 1;
        if (get(a, sortConfig.key) > get(b, sortConfig.key)) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, query, status, dateRange, sortConfig]);

  // Pagination Calculation
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedAndFilteredOrders]);

  const totalPages = Math.ceil(sortedAndFilteredOrders.length / itemsPerPage);

  // Sorting Handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="bi bi-arrow-down-up ms-2 text-muted small"></i>;
    if (sortConfig.direction === 'asc') return <i className="bi bi-sort-up ms-2"></i>;
    return <i className="bi bi-sort-down ms-2"></i>;
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <TopNav />
        <main className="dashboard-content">
          <div className="container-fluid p-4">

            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
              <h1 className="h3 mb-0">Orders Management</h1>
              <div className="d-flex gap-2">
                <Button variant="light" className="d-flex align-items-center gap-2">
                  <i className="bi bi-download"></i> Export
                </Button>
                <Button variant="primary" className="d-flex align-items-center gap-2">
                  <i className="bi bi-plus-lg"></i> Create Order
                </Button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-journal-text" label="Total Orders" value={orders.length} color="primary" /></div>
              <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-cash-coin" label="Total Revenue" value={`₹${orders.reduce((sum, o) => sum + (o.totalAmount||0), 0).toLocaleString()}`} color="success" /></div>
              <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-hourglass-split" label="Pending" value={orders.filter(o => o.status === 'Pending').length} color="warning" /></div>
              <div className="col-12 col-md-6 col-xl-3"><StatCard icon="bi-check-circle" label="Delivered" value={orders.filter(o => o.status === 'Delivered').length} color="info" /></div>
            </div>

            {/* Filters and Table */}
            <div className="card">
              <div className="card-header d-flex flex-wrap gap-3 align-items-center">
                <div className="input-group flex-grow-1" style={{ maxWidth: 300 }}>
                  <span className="input-group-text"><i className="bi bi-search"></i></span>
                  <input className="form-control" placeholder="Search by ID or customer" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small">From</label>
                  <input type="date" className="form-control" value={dateRange.start} onChange={e => setDateRange({ ...dateRange, start: e.target.value })} />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small">To</label>
                  <input type="date" className="form-control" value={dateRange.end} onChange={e => setDateRange({ ...dateRange, end: e.target.value })} />
                </div>
                <select className="form-select" style={{ maxWidth: 150 }} value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option>
                </select>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th><input type="checkbox" className="form-check-input" /></th>
                      <th onClick={() => requestSort('id')} className="sortable">Order ID {getSortIcon('id')}</th>
                      <th onClick={() => requestSort('total')} className="sortable">Total {getSortIcon('total')}</th>
                      <th>Discount</th>
                      <th>Coupon</th>
                      <th>Status</th>
                      <th onClick={() => requestSort('date')} className="sortable">Date {getSortIcon('date')}</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((o) => (
                      <tr key={o._id}>
                        <td><input type="checkbox" className="form-check-input" /></td>
                        <td className="fw-semibold">{o._id}</td>
                        <td className="text-nowrap">₹{Number(o.totalAmount||0).toLocaleString()}</td>
                        <td className="text-nowrap">{o.discount ? `-₹${Number(o.discount).toLocaleString()}` : '-'}</td>
                        <td>{o.couponCode || '-'}</td>
                        <td><span className={`badge rounded-pill ${statusBadge(o.status)}`}>{o.status}</span></td>
                        <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                        <td className="text-end d-flex justify-content-end gap-2">
                          <Button variant="light" size="sm" onClick={() => handleShowModal(o)}><i className="bi bi-eye"></i> View</Button>
                          <Link className="btn btn-sm btn-outline-primary" to={`/order/${o._id}/confirmation`}><i className="bi bi-receipt me-1"></i>Invoice</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginatedOrders.length === 0 && (
                  <div className="text-center text-muted p-5">
                    <h4>No Orders Found</h4>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
              {totalPages > 1 && (
                <div className="card-footer d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Showing {paginatedOrders.length} of {sortedAndFilteredOrders.length} results</span>
                  <BootstrapPagination>
                    <BootstrapPagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
                    {[...Array(totalPages).keys()].map(num => (
                      <BootstrapPagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                        {num + 1}
                      </BootstrapPagination.Item>
                    ))}
                    <BootstrapPagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
                  </BootstrapPagination>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Order Details: <span className="text-primary">{selectedOrder._id}</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <h5>Shipping Information</h5>
                <p className="mb-1"><strong>Name:</strong> {selectedOrder.shipping?.name || '-'}</p>
                <p className="mb-1"><strong>Phone:</strong> {selectedOrder.shipping?.phone || '-'}</p>
                <p className="mb-0"><strong>Address:</strong><br />
                  {selectedOrder.shipping?.address || '-'}<br />
                  {[selectedOrder.shipping?.city, selectedOrder.shipping?.state, selectedOrder.shipping?.zip].filter(Boolean).join(', ')}
                </p>
              </div>
              <div className="col-md-6">
                <h5>Order Summary</h5>
                <p><strong>Status:</strong> <span className={`badge rounded-pill ${statusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                <p><strong>Date:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' }) : '-'}</p>
                {selectedOrder.discount > 0 && (
                  <p className="mb-1"><strong>Discount:</strong> <span className="text-success">-₹{Number(selectedOrder.discount).toLocaleString()}</span> {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}</p>
                )}
                <p><strong>Total:</strong> <span className="fw-bold fs-5">₹{Number(selectedOrder.totalAmount||0).toLocaleString()}</span></p>
              </div>
            </div>
            <hr />
            <h5>Products Ordered ({Array.isArray(selectedOrder.products) ? selectedOrder.products.length : 0})</h5>
            <table className="table">
              <thead><tr><th>Product</th><th>Quantity</th><th className="text-end">Price</th><th className="text-end">Line Total</th></tr></thead>
              <tbody>
                {selectedOrder.products?.map(p => (
                  <tr key={p._id || p.product}>
                    <td>{p.product?.name || p.product}</td>
                    <td>{p.quantity}</td>
                    <td className="text-end">₹{Number(p.price).toLocaleString()}</td>
                    <td className="text-end">₹{Number(p.price * p.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleCloseModal}>Close</Button>
            <Button variant="primary"><i className="bi bi-printer me-2"></i>Print Invoice</Button>
          </Modal.Footer>
        </Modal>
      )}

    </div>
  );
}

export default Orders;
