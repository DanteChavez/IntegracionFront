import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/App.css';
import App from './App';  // Asegúrate de que la ruta sea correcta

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
