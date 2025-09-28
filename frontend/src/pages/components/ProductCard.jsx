import React, { useState } from 'react';
import './css/ProductCard.css';
import { useCart } from '../../context/CartContext.jsx';

const ProductCard = ({ product, onAdd }) => {
  const { add } = useCart ? useCart() : { add: null };
  const {
    name,
    price,
    stock,
    distributor,
    image,
    thumbnail,
    description,
  } = product || {};

  const imgSrc = image || thumbnail || 'https://via.placeholder.com/500x350?text=Product';
  const inStock = Number(stock) > 0;
  const [qty, setQty] = useState(1);
  const stepDown = () => setQty(q => Math.max(1, q - 1));
  const stepUp = () => setQty(q => Math.min(999, q + 1));

  return (
    <div className="product-card card h-100">
      <div className="product-media position-relative">
        <img src={imgSrc} alt={name} className="card-img-top" />
        <div className="stock-badge">
          <span className={`badge ${inStock ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
            {inStock ? `${stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="small text-muted mb-1 text-truncate" title={distributor?.name || ''}>
          {distributor?.name ? `by ${distributor.name}` : ' '}
        </div>
        <h6 className="card-title mb-1 text-truncate" title={name}>{name}</h6>
        {description && (
          <p className="card-text text-muted small mb-2 line-clamp-2">{description}</p>
        )}
        <div className="d-flex align-items-center justify-content-between mt-auto gap-2">
          <div className="price fw-bold">₹{Number(price || 0).toLocaleString()}</div>
          <div className="d-flex align-items-center gap-1">
            <button className="btn btn-sm btn-outline-secondary" disabled={!inStock} onClick={stepDown}>-</button>
            <input
              className="form-control form-control-sm text-center"
              style={{ width: 52 }}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
              disabled={!inStock}
            />
            <button className="btn btn-sm btn-outline-secondary" disabled={!inStock} onClick={stepUp}>+</button>
          </div>
          <button
            className="btn btn-sm btn-primary"
            disabled={!inStock}
            onClick={() => (onAdd ? onAdd({ ...product, qty }) : add && add(product, qty))}
            title={inStock ? 'Add to cart' : 'Out of stock'}
          >
            <i className="bi bi-cart-plus me-1"></i>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
