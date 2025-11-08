import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Import game configurations
import { yahtzeeConfig } from './games/yahtzee';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App config={yahtzeeConfig} />
  </React.StrictMode>
);
