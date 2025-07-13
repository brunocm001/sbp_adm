import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import { ServiceType, Service, Platform } from '../utils/api';

const ServiceTypesManager: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceId: '',
    platformId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('sbp_admin_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('sbp_admin_token');
      const [typesResponse, servicesResponse, platformsResponse] = await Promise.all([
        fetch('https://sbpapi-production.up.railway.app/service-types', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://sbpapi-production.up.railway.app/services', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://sbpapi-production.up.railway.app/platforms', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setServiceTypes(typesData.data || []);
      }
      
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.data || []);
      }
      
      if (platformsResponse.ok) {
        const platformsData = await platformsResponse.json();
        setPlatforms(platformsData.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('sbp_admin_token');
      const url = editingType 
        ? `https://sbpapi-production.up.railway.app/service-types/${editingType.id}`
        : 'https://sbpapi-production.up.railway.app/service-types';
      
      const response = await fetch(url, {
        method: editingType ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingType(null);
        setFormData({ name: '', description: '', serviceId: '', platformId: '' });
        loadData();
        alert(editingType ? 'Type mis à jour avec succès' : 'Type créé avec succès');
      }
    } catch (error) {
      console.error('Error saving service type:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (type: ServiceType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      description: type.description || '',
      serviceId: type.serviceId || '',
      platformId: type.platformId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce type ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('sbp_admin_token');
      const response = await fetch(`https://sbpapi-production.up.railway.app/service-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadData();
        alert('Type supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting service type:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    setEditingType(null);
    setFormData({ name: '', description: '', serviceId: '', platformId: '' });
    setShowModal(true);
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Service inconnu';
  };

  const getPlatformName = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.name || 'Plateforme inconnue';
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
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Types de Services" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Types de Services</h2>
              <button
                onClick={openCreateModal}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                + Nouveau Type
              </button>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plateforme
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceTypes.map((type) => (
                      <tr key={type.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {type.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {type.description || 'Aucune description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {type.serviceId ? getServiceName(type.serviceId) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {type.platformId ? getPlatformName(type.platformId) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(type)}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(type.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingType ? 'Modifier le Type' : 'Nouveau Type'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service (optionnel)
                  </label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Aucun service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plateforme (optionnel)
                  </label>
                  <select
                    value={formData.platformId}
                    onChange={(e) => setFormData({ ...formData, platformId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Aucune plateforme</option>
                    {platforms.map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
                  >
                    {editingType ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTypesManager; 