import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Header } from './react/components/Header';
import { HomePage } from './react/pages/HomePage';
import { DashboardPage } from './react/pages/DashboardPage';
import { SectionPage } from './react/pages/SectionPage';
import { GaleriePage } from './react/pages/GaleriePage';

const App: React.FC = () => {
    console.log("Rendering App...");
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/section" element={<SectionPage />} />
                <Route path="/galerie" element={<GaleriePage />} />
                <Route id='#dashboard' path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
};


const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found");
}
