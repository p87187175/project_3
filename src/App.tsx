import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import LoginForm from './components/LoginForm';
import Layout from './components/Layout';
import TailorDashboard from './pages/TailorDashboard';
import MechanicDashboard from './pages/MechanicDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HeadDashboard from './pages/HeadDashboard';
import ScanMachine from './pages/ScanMachine';

function AppContent() {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const { isLoading: dataLoading, error: dataError, refreshData } = useData();

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{authError}</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-4 py-2 rounded">Reload</button>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{dataError}</p>
          <button onClick={refreshData} className="bg-blue-600 text-white px-4 py-2 rounded">Retry</button>
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