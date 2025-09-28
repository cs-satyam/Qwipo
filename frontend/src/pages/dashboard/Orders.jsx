import React from 'react';
import { Card } from './MainContent';

const OrdersContent = ({ handleSelectItem }) => (
    <Card title="Order History & Quick Reorder">
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr className="text-start small fw-medium text-muted text-uppercase">
              <th scope="col" className="ps-3 pe-4 py-3">Order ID</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3">Total (₹)</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {[{id: 'ORD-7743', date: '2024-09-20', total: '12,500', status: 'Delivered'},
              {id: 'ORD-7601', date: '2024-09-10', total: '9,850', status: 'Delivered'},
              {id: 'ORD-7522', date: '2024-08-30', total: '15,100', status: 'Delivered'},
            ].map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 small fw-medium text-primary">{order.id}</td>
                <td className="px-4 py-4 small text-muted">{order.date}</td>
                <td className="px-4 py-4 small text-dark">₹{order.total}</td>
                <td className="px-4 py-4 small">
                  <span className="badge rounded-pill text-success bg-success-subtle fw-semibold">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 small fw-medium">
                  <button onClick={() => handleSelectItem(order.id)} className="btn btn-link text-primary fw-semibold p-0">
                    ⚡ Quick Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
);

export default OrdersContent;