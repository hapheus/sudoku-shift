import React from 'react';
import { createRoot } from 'react-dom/client';
import 'framework7/css';
import 'framework7/components/chip/css';
import './f7-init.js';
import './styles/app.css';
import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
