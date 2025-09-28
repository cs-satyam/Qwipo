import 'bootstrap/dist/css/bootstrap.min.css'; //  must import CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; //  enable dropdowns, collapse, modals
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
