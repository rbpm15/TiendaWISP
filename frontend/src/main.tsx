import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App.js';
import './styles/global.css';
import './styles/dashboard.css';
import './styles/chat.css';
import './styles/inventory.css';
import './styles/clients.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
