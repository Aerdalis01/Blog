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
import { ArticleDetail } from './react/pages/ArticleDetail';
import { SectionDetail } from './react/pages/SectionDetail';
import { LoginPage } from './react/components/auth/login';
import { RegisterPage } from './react/components/auth/auth';
import { ResetPasswordPage } from './react/pages/ResetPasswordPage';
import { ResetPassword } from './react/components/auth/resetPassword';


const App: React.FC = () => {

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/section" element={<SectionPage />} />
                <Route path="/galerie" element={<GaleriePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route path="/reset-password/success" element={<ResetPasswordPage />} />
                <Route id='#dashboard' path="/dashboard" element={<DashboardPage />} />
                <Route path="/section/:sectionId" element={<SectionDetail  />} />
                <Route path="/article/:articleId" element={<ArticleDetail />} />
                
            </Routes>
        </Router>
    );
};


const rootElement = document.getElementById("root");

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found");
}
