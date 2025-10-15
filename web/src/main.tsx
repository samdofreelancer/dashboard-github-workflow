import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css'; // <— đã import ở App nhưng import thêm ở đây cũng OK (idempotent)

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
