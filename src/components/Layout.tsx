import React from 'react';
import { Factory, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { dashboardStats } = useData();

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tailor': return 'bg-green-100 text-green-800';
      case 'mechanic': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'head': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Factory Management</h1>
                <p className="text-xs text-gray-500">Intercommunication System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification indicator */}
              {dashboardStats.openComplaints > 0 && (
                <div className="relative">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {dashboardStats.openComplaints}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-2" />
              </div>

              <button
                onClick={async () => { await logout(); }}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}