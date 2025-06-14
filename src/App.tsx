import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import TailorDashboard from './pages/TailorDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HeadDashboard from './pages/HeadDashboard';
import ScanMachine from './pages/ScanMachine';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'tailor':
        return <TailorDashboard />;
      case 'mechanic':
        return <MechanicDashboard />;
      case 'manager':
        return <ManagerDashboard />;
      case 'head':
        return <HeadDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout>
      <Routes>
        <Route path="/scan" element={<ScanMachine />} />
        <Route path="/" element={renderDashboard()} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;