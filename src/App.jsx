// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './styles/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './components/LoadingSpinner'; // Import a loading spinner
import { LoadingProvider } from './context/LoadingContext';

// Lazy-loaded components
const Login = lazy(() => import('./components/Auth/Login'));
const AdminDashboard = lazy(() => import('./components/AdminModule/AdminModule'));
const UserModule = lazy(() => import('./components/UserModule/UserModule'));

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <LoadingProvider>
                <Router>
                    <AuthProvider>
                       <ToastContainer position="bottom-right" autoClose={3000} />
                        <AppRoutes />
                    </AuthProvider>
                </Router>
            </LoadingProvider>
        </ThemeProvider>
    );
};

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to='/login' />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to='/' />;
    }

    return children;
};

const AppRoutes = () => {
    const { user, loading } = useAuth();

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route
                    path="/login"
                    element={user ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            {user &&
                                (user.role === 'admin' ? <AdminDashboard /> : <UserModule />)
                            }
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Suspense>
    );
};


export default App;