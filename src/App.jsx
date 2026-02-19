import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ReflexMenuPage from './pages/ReflexMenuPage';
import ReflexGamePage from './pages/ReflexGamePage';
import ReflexResultPage from './pages/ReflexResultPage';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<ReflexMenuPage />} />
                    <Route path="/game" element={<ReflexGamePage />} />
                    <Route path="/result" element={<ReflexResultPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
