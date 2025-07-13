import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activePlatforms: number;
  pendingTickets: number;
}

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('sbp_admin_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Load dashboard stats
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const token = localStorage.getItem('sbp_admin_token');
      
      // Fetch stats from API
      const [ordersResponse, platformsResponse, ticketsResponse] = await Promise.all([
        fetch('https://sbpapi-production.up.railway.app/orders?page=1&limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://sbpapi-production.up.railway.app/platforms', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://sbpapi-production.up.railway.app/tickets?page=1&limit=1', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const ordersData = await ordersResponse.json();
      const platformsData = await platformsResponse.json();
      const ticketsData = await ticketsResponse.json();

      setStats({
        totalOrders: ordersData.data?.total || 0,
        totalRevenue: 0, // This would need a separate endpoint
        activePlatforms: platformsData.data?.filter((p: any) => p.isActive)?.length || 0,
        pendingTickets: ticketsData.data?.tickets?.filter((t: any) => t.status === 'open')?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('sbp_admin_token');
      await fetch('https://sbpapi-production.up.railway.app/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sbp_admin_token');
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Tableau de bord" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Orders */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Commandes
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.totalOrders || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Revenus Totaux
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.totalRevenue?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) || '0 €'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Platforms */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Plateformes Actives
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.activePlatforms || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Tickets */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Tickets en Attente
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats?.pendingTickets || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Actions Rapides</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <a
                    href="/platforms"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🌐</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Gérer les Plateformes</h4>
                      <p className="text-sm text-gray-500">Ajouter ou modifier des plateformes</p>
                    </div>
                  </a>

                  <a
                    href="/services"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Gérer les Services</h4>
                      <p className="text-sm text-gray-500">Configurer les services disponibles</p>
                    </div>
                  </a>

                  <a
                    href="/orders"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Voir les Commandes</h4>
                      <p className="text-sm text-gray-500">Suivre les commandes en cours</p>
                    </div>
                  </a>

                  <a
                    href="/tickets"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🎫</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Support Client</h4>
                      <p className="text-sm text-gray-500">Gérer les tickets de support</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 