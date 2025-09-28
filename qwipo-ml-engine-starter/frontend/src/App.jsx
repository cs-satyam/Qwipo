import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';

function App() {
  const [retailerId, setRetailerId] = useState('');
  const [results, setResults] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/recommend/${retailerId}?top_k=5&include_trending=true`
      );
      setResults(res.data);
    } catch (err) {
      alert('Error fetching recommendations');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Qwipo Product Recommendation</h1>
      <SearchBar
        retailerId={retailerId}
        setRetailerId={setRetailerId}
        onSearch={fetchRecommendations}
      />

      {results && (
        <>
          <h2>Recommendations for {results.retailer_id}</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {results.recommendations.map((r) => {
              // Find explanation text for this product
              const explanationItem = results.explanation.items.find(
                (item) => item.title === r.title
              );
              return (
                <li key={r.product_id} style={{ marginBottom: '20px' }}>
                  <strong>
                    {r.title} {r.trending && "(Trending)"}
                  </strong>
                  <p style={{ margin: '5px 0 0 0' }}>
                    {explanationItem ? explanationItem.text : ""}
                  </p>
                </li>
              );
            })}
          </ul>
          {results.explanation.tip && (
            <div style={{ marginTop: '30px', padding: '10px', backgroundColor: '#090909ff' }}>
              <strong>Actionable Tip:</strong>
              <p>{results.explanation.tip}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
