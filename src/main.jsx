import React from 'react';
import ReactDOM from 'react-dom/client';

import '@arco-design/web-react/dist/css/arco.min.css';
import './index.css';

import App from './App';

window.wt = new WebTorrent();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
