import React, { useState } from 'react';

// --- Utility Components ---

// 1. Card Component (Bootstrap CSS)
// Used for displaying each product item consistently.
const Card = ({ children, className = '' }) => (
    <div className={`card h-100 ${className} border-0 shadow-sm transition-shadow`} 
         style={{ borderRadius: '0.75rem', transition: 'box-shadow 0.3s' }}> 
      <div className="card-body p-0 d-flex flex-column">
        {children}
      </div>
    </div>
);

// 2. Star Rating Utility
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="text-warning small d-flex align-items-center">
            {'★'.repeat(fullStars)}
            {hasHalfStar && <span className="text-warning">½</span>}
            {'☆'.repeat(emptyStars)}
            <span className="ms-2 text-muted fw-bold" style={{ fontSize: '0.75rem' }}>({rating} / 5)</span>
        </div>
    );
};

// --- Mock Product Data ---
const mockProducts = [
    { id: 1, name: 'Premium Basmati Rice (5kg)', price: 450, rating: 4.5, image: 'Rice' },
    { id: 2, name: 'Fresh Cooking Oil (1L Bottle)', price: 180, rating: 4.2, image: 'Oil' },
    { id: 3, name: 'Bulk Organic Flour (10kg)', price: 620, rating: 4.8, image: 'Flour' },
    { id: 4, name: 'Assorted Energy Drinks (Case)', price: 799, rating: 3.9, image: 'Drinks' },
    { id: 5, name: 'Whole Milk Cartons (12 Pack)', price: 420, rating: 4.6, image: 'Milk' },
    { id: 6, name: 'Frozen Chicken Breasts (2kg)', price: 550, rating: 4.1, image: 'Chicken' },
    { id: 7, name: 'Fresh Tomato Ketchup (500g)', price: 95, rating: 4.4, image: 'Ketchup' },
    { id: 8, name: 'Premium Dark Chocolate Bar', price: 150, rating: 4.9, image: 'Chocolate' },
];

// --- Main Product Catalog Component ---
const ProductCatalogContent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMessage, setStatusMessage] = useState('Welcome to the Product Catalog!');

    // Logic to filter products based on search term
    const filteredProducts = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddToCart = (productName) => {
        setStatusMessage(`✅ Added 1 unit of ${productName} to cart.`);
    };

    const handleGiveFeedback = (productName) => {
        setStatusMessage(`📝 Giving feedback on ${productName}. Thank you for your input!`);
    };

    return (
        <div className="p-0">
            <h2 className="fs-4 fw-bold text-dark mb-4">🛍️ Complete Product Catalog</h2>
            
            {/* Status Message Display */}
            <div className="alert alert-info small fw-bold rounded-3 mb-4">{statusMessage}</div>
            
            {/* Search Input */}
            <div className="mb-5">
                <input
                    type="text"
                    className="form-control form-control-lg rounded-pill border-primary shadow-sm"
                    placeholder="Search products (e.g., 'Rice' or 'Milk')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Product Grid (Responsive Row/Cols) */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {filteredProducts.map(product => (
                    <div className="col" key={product.id}>
                        <Card>
                            {/* Product Image Placeholder */}
                            <img 
                                src={`https://placehold.co/400x300/F0F8FF/3A5AFE?text=${product.image}`} 
                                className="card-img-top p-3" 
                                alt={product.name} 
                                style={{ objectFit: 'cover', borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem' }}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/808080/ffffff?text=Image+NA" }}
                            />
                            
                            <div className="p-3 d-flex flex-column flex-grow-1">
                                <h6 className="card-title fw-bold text-dark mb-1">{product.name}</h6>
                                <p className="text-primary fw-bolder fs-5 mb-2">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </p>
                                
                                {/* Ratings and Feedback */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <StarRating rating={product.rating} />
                                    <button 
                                        onClick={() => handleGiveFeedback(product.name)}
                                        className="btn btn-sm btn-outline-secondary rounded-pill small"
                                    >
                                        Give Feedback
                                    </button>
                                </div>

                                {/* Action Button */}
                                <button 
                                    onClick={() => handleAddToCart(product.name)}
                                    className="btn btn-primary fw-bold mt-auto rounded-3"
                                >
                                    <span className="me-2">🛒</span> Add to Cart
                                </button>
                            </div>
                        </Card>
                    </div>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-12 text-center py-5">
                        <p className="lead text-muted">No products found matching "{searchTerm}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalogContent;
