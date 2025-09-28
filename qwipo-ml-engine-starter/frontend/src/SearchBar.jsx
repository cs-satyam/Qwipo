import React from 'react';

function SearchBar({ retailerId, setRetailerId, onSearch }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={retailerId}
        placeholder="Enter Retailer ID (e.g., 201)"
        onChange={e => setRetailerId(e.target.value)}
      />
      <button onClick={onSearch} style={{ marginLeft: '10px' }}>
        Get Recommendations
      </button>
    </div>
  );
}

export default SearchBar;
