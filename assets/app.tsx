import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import { Header } from './react/components/Header';
import { HomePage } from './react/pages/HomePage';
import { DashboardPage } from './react/pages/DashboardPage';


const App: React.FC = () => {
    console.log("Rendering App...");
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route id='#dashboard' path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
};
// const App = () => {
//     console.log("Rendering Test Component...");
//     return <h1>Hello, React is working!</h1>;
// };

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found");
}
