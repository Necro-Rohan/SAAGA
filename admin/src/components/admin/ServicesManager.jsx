import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../utils/api';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        isActive: true
    });

    const fetchServices = async () => {
        try {
            const res = await api.services.getAll();
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingService) {
                await api.services.update(editingService._id, formData);
            } else {
                await api.services.create(formData);
            }
            setIsModalOpen(false);
            setEditingService(null);
            setFormData({ name: '', category: '', price: '', description: '', image: '', isActive: true });
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.services.delete(id);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData(service);
        } else {
            setEditingService(null);
            setFormData({ name: '', category: '', price: '', description: '', image: '', isActive: true });
        }
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <div key={service._id} className={`overflow-hidden rounded-xl border bg-white shadow-sm ${!service.isActive ? 'opacity-60' : ''}`}>
                        {service.image && (
                            <img src={service.image} alt={service.name} className="h-48 w-full object-cover" />
                        )}
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{service.name}</h3>
                                    <p className="text-sm text-gray-500">{service.category}</p>
                                </div>
                                <span className="font-bold">₹{service.price}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{service.description}</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button onClick={() => openModal(service)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(service._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold">{editingService ? 'Edit Service' : 'Add Service'}</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="h-6 w-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                placeholder="Service Name"
                                className="w-full rounded-lg border p-2"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Category (e.g. Hair, Skin)"
                                className="w-full rounded-lg border p-2"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Price (INR)"
                                className="w-full rounded-lg border p-2"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="w-full rounded-lg border p-2"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <input
                                placeholder="Image URL"
                                className="w-full rounded-lg border p-2"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <span>Active (Visible on Site)</span>
                            </label>
                            <button type="submit" className="w-full rounded-lg bg-black py-2 text-white font-bold">
                                {editingService ? 'Update Service' : 'Create Service'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;
