import React from 'react';
import Card from './Card';

const Inventory = () => {
  const items = [
    { sku: 'SKU-ATT-10', name: 'Aashirvaad Atta 10kg', stock: 120, reorder: 80 },
    { sku: 'SKU-COIL-1', name: 'Cooking Oil 1L', stock: 45, reorder: 60 },
    { sku: 'SKU-SALT-1', name: 'Tata Salt 1kg', stock: 320, reorder: 150 },
    { sku: 'SKU-CBC-250', name: 'Cold Brew Coffee 250ml', stock: 28, reorder: 40 },
  ];

  return (
    <div className="container-fluid py-4">
      <Card title="Current Stock">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th className="ps-3">SKU</th>
                <th>Product</th>
                <th>In Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const low = it.stock < it.reorder;
                return (
                  <tr key={it.sku}>
                    <td className="ps-3 fw-semibold">{it.sku}</td>
                    <td>{it.name}</td>
                    <td>{it.stock}</td>
                    <td>{it.reorder}</td>
                    <td>
                      <span className={`badge rounded-pill ${low ? 'text-bg-danger' : 'text-bg-success'}`}>
                        {low ? 'Low' : 'OK'}
                      </span>
                    </td>
                    <td className="text-end pe-3">
                      <button className="btn btn-sm btn-outline-primary me-2">Adjust</button>
                      <button className="btn btn-sm btn-primary">Reorder</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Inventory;
