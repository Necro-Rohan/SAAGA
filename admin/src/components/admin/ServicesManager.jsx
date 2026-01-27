import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, GripVertical, FolderPlus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../utils/api';

const ServicesManager = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        category: '',
        subcategory: '',
        prices: { male: '', female: '' },
        description: '',
        image: '',
        isActive: true
    });

    const [newSubcategory, setNewSubcategory] = useState('');
    const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null); // categoryId
    const [editingSubcategory, setEditingSubcategory] = useState(null); // { catId: '...', oldName: '...', newName: '...' }

    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        image: '',
        subcategories: [],
        order: 0
    });

    // Extracted ServiceItem component for reuse
    const ServiceItem = ({ service, index, openServiceModal, handleServiceDelete, formatPrice }) => (
        <Draggable draggableId={service._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group flex items-center gap-4 py-5 px-2 border-b border-brown-200 hover:bg-brown-50/50 transition-all ${snapshot.isDragging ? 'bg-white shadow-xl ring-2 ring-brown-900/10 rounded-xl border-none' : ''
                        }`}
                >
                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-brown-300 hover:text-brown-500">
                        <GripVertical className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h4 className="text-lg font-medium text-brown-900">
                                {service.name}
                            </h4>
                            {!service.isActive && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    Inactive
                                </span>
                            )}
                        </div>
                        {service.description && (
                            <p className="text-sm text-brown-500 mt-1 line-clamp-1">
                                {service.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8">
                        <span className="text-lg font-serif text-brown-900 font-medium whitespace-nowrap">
                            {formatPrice(service)}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => openServiceModal(service)}
                                className="p-2 text-brown-600 hover:bg-brown-100 rounded-full transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleServiceDelete(service._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );

    // Group services by category
    const groupServicesByCategory = (servicesData, categoriesFromDb) => {
        const grouped = {};

        // First, add all categories from database
        categoriesFromDb.forEach(cat => {
            if (!grouped[cat.name]) {
                grouped[cat.name] = {
                    name: cat.name,
                    services: [],
                    services: [],
                    image: cat.image,
                    _id: cat._id,
                    subcategories: cat.subcategories,
                    order: cat.order
                };
            }
        });

        // Then, add services to their categories
        servicesData.forEach(service => {
            if (!grouped[service.category]) {
                // If category doesn't exist in DB, create a default one
                grouped[service.category] = {
                    name: service.category,
                    services: [],
                    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
                    order: 999
                };
            }
            grouped[service.category].services.push(service);
        });

        // Convert to array and sort by order
        return Object.values(grouped).sort((a, b) => a.order - b.order);
    };

    const fetchServices = async () => {
        try {
            const [servicesRes, categoriesRes] = await Promise.all([
                api.services.getAll(),
                api.categories.getAll()
            ]);

            const servicesData = await servicesRes.json();
            const categoriesData = await categoriesRes.json();

            setServices(servicesData);
            setDbCategories(categoriesData);
            setCategories(groupServicesByCategory(servicesData, categoriesData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert prices to numbers
            const formattedData = {
                ...serviceFormData,
                prices: {
                    male: serviceFormData.prices.male ? Number(serviceFormData.prices.male) : undefined,
                    female: serviceFormData.prices.female ? Number(serviceFormData.prices.female) : undefined
                }
            };

            if (editingService) {
                await api.services.update(editingService._id, formattedData);
            } else {
                await api.services.create(formattedData);
            }
            setIsServiceModalOpen(false);
            setEditingService(null);
            setServiceFormData({
                name: '',
                category: '',
                subcategory: '',
                prices: { male: '', female: '' },
                description: '',
                image: '',
                isActive: true
            });
            fetchServices();
        } catch (error) {
            console.error('Error saving service:', error);
        }
    };

    const handleServiceDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await api.services.delete(id);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.categories.update(editingCategory._id, categoryFormData);
            } else {
                await api.categories.create(categoryFormData);
            }
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
            setEditingCategory(null);
            setCategoryFormData({ name: '', image: '', subcategories: [], order: 0 });
            setNewSubcategory('');
            fetchServices();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error: ' + (error.message || 'Could not save category'));
        }
    };

    const handleSubcategoryRename = async () => {
        if (!editingSubcategory || !editingSubcategory.newName.trim()) return;

        const { catId, oldName, newName } = editingSubcategory;
        if (oldName === newName) {
            setEditingSubcategory(null);
            return;
        }

        try {
            const category = categories.find(c => c._id === catId);
            if (!category) return;

            // 1. Update Category subcategories list
            const updatedSubcategories = category.subcategories.map(s =>
                s.name === oldName ? { ...s, name: newName } : s
            );

            // 2. Prepare API calls
            // Update Category
            await api.categories.update(catId, { ...category, subcategories: updatedSubcategories });

            // Update all related services
            const relatedServices = services.filter(s => s.category === category.name && s.subcategory === oldName);
            await Promise.all(relatedServices.map(s =>
                api.services.update(s._id, { subcategory: newName })
            ));

            setEditingSubcategory(null);
            fetchServices();
        } catch (error) {
            console.error('Error renaming subcategory:', error);
            alert('Failed to rename subcategory');
        }
    };

    const handleSubcategoryDelete = async (catId, subName) => {
        if (!window.confirm(`Delete subcategory "${subName}"? Services will be moved to General.`)) return;

        try {
            const category = categories.find(c => c._id === catId);
            if (!category) return;

            const updatedSubcategories = category.subcategories.filter(s => s.name !== subName);
            await api.categories.update(catId, { ...category, subcategories: updatedSubcategories });

            // Optional: Standardize services to have empty subcategory if needed, 
            // but they will automatically fall into "General" (Uncategorized) logic in the UI loop anyway
            // because `subName` is no longer in `updatedSubcategories`.
            // Ideally we should clear the string in DB too for consistency.
            const relatedServices = services.filter(s => s.category === category.name && s.subcategory === subName);
            await Promise.all(relatedServices.map(s =>
                api.services.update(s._id, { subcategory: '' })
            ));

            fetchServices();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
            alert('Failed to delete subcategory');
        }
    };

    const handleCreateSubcategory = async (categoryId) => {
        if (!newSubcategory.trim()) return;

        try {
            const category = categories.find(c => c._id === categoryId);
            if (!category) return;

            // Check duplicate
            if (category.subcategories?.some(s => s.name.toLowerCase() === newSubcategory.trim().toLowerCase())) {
                alert('Subcategory already exists');
                return;
            }

            const updatedSubcategories = [...(category.subcategories || []), { name: newSubcategory.trim() }];
            await api.categories.update(categoryId, { ...category, subcategories: updatedSubcategories });

            setNewSubcategory('');
            setAddingSubcategoryTo(null);
            fetchServices();
        } catch (error) {
            console.error('Error creating subcategory:', error);
            alert('Failed to create subcategory');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // Parse droppableIds to get category and subcategory
        // Format: "CategoryName" or "CategoryName::SubcategoryName"
        const [sourceCat, sourceSub] = source.droppableId.split('::');
        const [destCat, destSub] = destination.droppableId.split('::');

        // Only allow reordering within the same Category (for now, to simplify)
        // If we want to allow moving between Categories, that's a bigger change (requires updating service.category)
        // But moving between Subcategories within the same Category is what we want.

        if (sourceCat !== destCat) return;

        // Find the category object
        const categoryIndex = categories.findIndex(c => c.name === sourceCat);
        if (categoryIndex === -1) return;

        const category = categories[categoryIndex];
        const newServices = [...category.services];

        // Find the service in the list
        const serviceIndex = newServices.findIndex(s => s._id === draggableId);
        if (serviceIndex === -1) return;
        const service = newServices[serviceIndex];

        // Changing Subcategory?
        const newSubcategory = destSub || '';
        const oldSubcategory = sourceSub || '';

        // Remove from old position (conceptually, we just re-sort the whole list later or handle indices)
        // Actually, since current `categories` state is just a flat list of services, 
        // dragging between "visual" lists implies changing the `subcategory` field.

        if (newSubcategory !== oldSubcategory) {
            // Update the service locally
            service.subcategory = newSubcategory;

            // Update in Backend
            try {
                await api.services.update(service._id, { subcategory: newSubcategory });
            } catch (err) {
                console.error("Failed to update subcategory on drag", err);
                // Revert would be ideal here but let's assume success or refresh
            }
        }

        // Handling Reordering is tricky because they are in different "visual" lists but one "data" list.
        // For this specific iteration, let's just update the Subcategory and let the list re-render standard sort.
        // If we want precise manual order, we need a global `order` field on services.
        // Assuming we rely on default sort order (which is usually insertion or name), 
        // or we just update the local state to reflect the move.

        const newCategories = [...categories];
        newCategories[categoryIndex].services = newServices; // updated service is inside
        setCategories(newCategories);
    };

    const openServiceModal = (service = null, categoryName = '') => {
        if (service) {
            setEditingService(service);
            setServiceFormData({
                ...service,
                prices: {
                    male: service.prices?.male || '',
                    female: service.prices?.female || ''
                }
            });
        } else {
            setEditingService(null);
            setServiceFormData({
                name: '',
                category: categoryName,
                subcategory: '',
                prices: { male: '', female: '' },
                description: '',
                image: '',
                isActive: true
            });
        }
        setIsServiceModalOpen(true);
    };

    const handleAddSubcategory = () => {
        if (!newSubcategory.trim()) return;
        setCategoryFormData({
            ...categoryFormData,
            subcategories: [...(categoryFormData.subcategories || []), { name: newSubcategory.trim() }]
        });
        setNewSubcategory('');
    };

    const handleRemoveSubcategory = (index) => {
        const updated = [...(categoryFormData.subcategories || [])];
        updated.splice(index, 1);
        setCategoryFormData({ ...categoryFormData, subcategories: updated });
    };

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryFormData({
                name: category.name,
                image: category.image,
                subcategories: category.subcategories || [],
                order: category.order || 0
            });
        } else {
            setEditingCategory(null);
            const maxOrder = dbCategories.reduce((max, cat) => Math.max(max, cat.order || 0), 0);
            setCategoryFormData({ name: '', image: '', subcategories: [], order: maxOrder + 1 });
        }
        setIsCategoryModalOpen(true);
    };

    const formatPrice = (service) => {
        if (service.prices?.male && service.prices?.female) {
            return `₹${service.prices.male} / ₹${service.prices.female}`;
        } else if (service.prices?.male) {
            return `₹${service.prices.male}`;
        } else if (service.prices?.female) {
            return `₹${service.prices.female}`;
        }
        return 'Price not set';
    };

    return (
        <div className="min-h-screen bg-cream">
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-brown-900">Manage Services</h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => openCategoryModal()}
                        className="flex items-center rounded-full bg-brown-600 px-5 py-2.5 text-sm text-white hover:bg-brown-700 transition-all shadow-md"
                    >
                        <FolderPlus className="mr-2 h-4 w-4" />
                        Add Category
                    </button>
                    <button
                        onClick={() => openServiceModal()}
                        className="flex items-center rounded-full bg-brown-900 px-6 py-3 text-white hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Service
                    </button>
                </div>
            </div>

            {/* Services grouped by category with drag and drop */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex flex-col gap-16">
                    {categories.map((category, categoryIdx) => (
                        <section key={categoryIdx} className="scroll-mt-40">
                            {/* Category Header with Image */}
                            <div className="mb-8 rounded-3xl overflow-hidden relative h-48 md:h-56 shadow-xl group">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover object-center"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-between px-8 backdrop-blur-[2px]">
                                    <div>
                                        <h3 className="font-serif text-3xl md:text-4xl text-white tracking-wide drop-shadow-lg">
                                            {category.name}
                                        </h3>
                                        <p className="text-white/80 text-sm mt-2 drop-shadow">
                                            {category.services.length} {category.services.length === 1 ? 'service' : 'services'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openServiceModal(null, category.name)}
                                            className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                            title="Add service to this category"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setAddingSubcategoryTo(category._id)}
                                            className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                            title="Add subcategory"
                                        >
                                            <FolderPlus className="h-5 w-5" />
                                        </button>
                                        {category._id && (
                                            <button
                                                onClick={() => openCategoryModal(category)}
                                                className="bg-white/90 text-brown-900 p-3 rounded-full hover:bg-white transition-all shadow-lg"
                                                title="Edit category"
                                            >
                                                <Edit2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Category Sub-Groups */}
                            <div className="space-y-4">
                                {(() => {
                                    // 1. Group services dynamically
                                    const groups = {};
                                    // Initialize with defined subcategories to ensure order
                                    (category.subcategories || []).forEach(sub => {
                                        groups[sub.name] = [];
                                    });
                                    // Add services to groups
                                    category.services.forEach(service => {
                                        const subName = service.subcategory || '';
                                        if (!groups[subName]) {
                                            groups[subName] = [];
                                        }
                                        groups[subName].push(service);
                                    });

                                    // 2. Determine display order
                                    const definedOrder = (category.subcategories || []).map(s => s.name);
                                    const allGroupNames = Object.keys(groups).filter(name => name !== ''); // Exclude General for now
                                    // Sort: defined ones first (in order), then others alphabetically
                                    const sortedGroupNames = allGroupNames.sort((a, b) => {
                                        const idxA = definedOrder.indexOf(a);
                                        const idxB = definedOrder.indexOf(b);
                                        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                                        if (idxA !== -1) return -1;
                                        if (idxB !== -1) return 1;
                                        return a.localeCompare(b);
                                    });

                                    // 3. Render Groups
                                    return (
                                        <>
                                            {/* Add Subcategory Input */}
                                            {addingSubcategoryTo === category._id && (
                                                <div className="mt-6 mb-8 pl-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                                    <div className="flex items-center gap-2 max-w-md">
                                                        <input
                                                            type="text"
                                                            value={newSubcategory}
                                                            onChange={(e) => setNewSubcategory(e.target.value)}
                                                            className="text-2xl font-serif text-brown-900 bg-transparent border-b-2 border-brown-900 px-0 py-1 w-full focus:outline-none placeholder-brown-300"
                                                            placeholder="New Subcategory Name"
                                                            autoFocus
                                                            onKeyPress={(e) => e.key === 'Enter' && handleCreateSubcategory(category._id)}
                                                        />
                                                        <button
                                                            onClick={() => handleCreateSubcategory(category._id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                                            title="Create"
                                                        >
                                                            <Plus className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setAddingSubcategoryTo(null);
                                                                setNewSubcategory('');
                                                            }}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                            title="Cancel"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Subcategories */}
                                            {sortedGroupNames.map(subName => {
                                                const subcatServices = groups[subName];
                                                const isEditing = editingSubcategory?.catId === category._id && editingSubcategory?.oldName === subName;

                                                return (
                                                    <div key={subName} className="mt-6 mb-2 group/sub pl-2">
                                                        <div className="flex items-center justify-between mb-3">
                                                            {isEditing ? (
                                                                <div className="flex items-center gap-2 flex-1">
                                                                    <input
                                                                        type="text"
                                                                        value={editingSubcategory.newName}
                                                                        onChange={(e) => setEditingSubcategory({ ...editingSubcategory, newName: e.target.value })}
                                                                        className="text-2xl font-serif text-brown-900 bg-transparent border-b-2 border-brown-900 px-0 py-1 w-full max-w-sm focus:outline-none"
                                                                        autoFocus
                                                                        onKeyPress={(e) => e.key === 'Enter' && handleSubcategoryRename()}
                                                                    />
                                                                    <button
                                                                        onClick={handleSubcategoryRename}
                                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                                                                        title="Save"
                                                                    >
                                                                        <Plus className="h-5 w-5 rotate-45 transform" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setEditingSubcategory(null)}
                                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                                        title="Cancel"
                                                                    >
                                                                        <X className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="text-2xl font-serif text-brown-900">
                                                                        {subName}
                                                                    </h4>
                                                                    <div className="flex opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => setEditingSubcategory({ catId: category._id, oldName: subName, newName: subName })}
                                                                            className="p-2 text-brown-400 hover:text-brown-600 rounded-full transition-colors"
                                                                            title="Rename subcategory"
                                                                        >
                                                                            <Edit2 className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleSubcategoryDelete(category._id, subName)}
                                                                            className="p-2 text-red-400 hover:text-red-600 rounded-full transition-colors"
                                                                            title="Delete subcategory"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <Droppable droppableId={`${category.name}::${subName}`}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.droppableProps}
                                                                    className={`min-h-[50px] transition-colors pl-6 border-l-2 border-brown-100 ml-2 ${snapshot.isDraggingOver ? 'bg-brown-50/30 rounded-lg' : ''}`}
                                                                >
                                                                    {subcatServices.length === 0 ? (
                                                                        <div className="text-center py-4 text-brown-300 italic text-sm">
                                                                            <p>No services</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-0">
                                                                            {subcatServices.map((service, index) => (
                                                                                <ServiceItem
                                                                                    key={service._id}
                                                                                    service={service}
                                                                                    index={index}
                                                                                    openServiceModal={openServiceModal}
                                                                                    handleServiceDelete={handleServiceDelete}
                                                                                    formatPrice={formatPrice}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </div>
                                                );
                                            })}

                                            {/* General / Uncategorized */}
                                            {(() => {
                                                const generalServices = groups[''] || [];
                                                // Always show General area if it has services OR if there are no subcategories at all (to allow dropping)
                                                // OR if the user just wants a "Catch all" area.
                                                // The image shows a flat list if no subcats.
                                                // If there ARE subcats, General should be labeled "General" or similar?
                                                // User wants a TREE. So General services are just siblings to Subcategory Folders? Or separate?
                                                // Let's create a "General" group at the bottom if needed.

                                                if (generalServices.length > 0 || sortedGroupNames.length > 0) {
                                                    return (
                                                        <div className="mt-8 pl-2">
                                                            {sortedGroupNames.length > 0 && generalServices.length > 0 && (
                                                                <h4 className="text-xl font-serif text-brown-800 mb-4 italic opacity-70">
                                                                    General Services
                                                                </h4>
                                                            )}
                                                            <Droppable droppableId={`${category.name}::`}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.droppableProps}
                                                                        className={`min-h-[50px] transition-colors ${sortedGroupNames.length > 0 ? 'pl-6 border-l-2 border-brown-100 ml-2' : ''} ${snapshot.isDraggingOver ? 'bg-brown-50/30 rounded-lg' : ''}`}
                                                                    >
                                                                        {generalServices.length === 0 ? (
                                                                            <div className="text-center py-6 text-brown-300 italic text-sm">
                                                                                {sortedGroupNames.length === 0 ? <p>Drop services here</p> : <p>Drop general services here</p>}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-0">
                                                                                {generalServices.map((service, index) => (
                                                                                    <ServiceItem
                                                                                        key={service._id}
                                                                                        service={service}
                                                                                        index={index}
                                                                                        openServiceModal={openServiceModal}
                                                                                        handleServiceDelete={handleServiceDelete}
                                                                                        formatPrice={formatPrice}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                        {provided.placeholder}
                                                                    </div>
                                                                )}
                                                            </Droppable>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </>
                                    );
                                })()}
                            </div>
                        </section>
                    ))}

                    {categories.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-xl text-brown-600 mb-6">No categories yet. Add your first category to get started!</p>
                            <button
                                onClick={() => openCategoryModal()}
                                className="bg-brown-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg"
                            >
                                <FolderPlus className="inline h-5 w-5 mr-2" />
                                Add First Category
                            </button>
                        </div>
                    )}
                </div>
            </DragDropContext>

            {/* Service Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-serif font-bold text-brown-900">
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button
                                onClick={() => setIsServiceModalOpen(false)}
                                className="text-brown-600 hover:text-brown-900 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleServiceSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-2">
                                        Service Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., French/Ombre Extensions"
                                        className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={serviceFormData.name}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={serviceFormData.category}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {dbCategories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-2">
                                        Subcategory (Optional)
                                    </label>
                                    <select
                                        className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={serviceFormData.subcategory}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, subcategory: e.target.value })}
                                        disabled={!serviceFormData.category}
                                    >
                                        <option value="">Select Subcategory</option>
                                        {serviceFormData.category && dbCategories
                                            .find(cat => cat.name === serviceFormData.category)
                                            ?.subcategories?.map((sub, idx) => (
                                                <option key={idx} value={sub.name}>{sub.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-2">
                                        Price (Male) - INR
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 500"
                                        className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={serviceFormData.prices.male}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, prices: { ...serviceFormData.prices, male: e.target.value } })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-brown-900 mb-2">
                                        Price (Female) - INR
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g., 600"
                                        className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={serviceFormData.prices.female}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, prices: { ...serviceFormData.prices, female: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    placeholder="Describe the service..."
                                    rows="3"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none resize-none"
                                    value={serviceFormData.description}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Image URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                    value={serviceFormData.image}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, image: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-brown-50/50 p-4 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={serviceFormData.isActive}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, isActive: e.target.checked })}
                                    className="w-5 h-5 text-brown-900 border-brown-300 rounded focus:ring-brown-900"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-brown-900 cursor-pointer">
                                    Active (Visible on website)
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsServiceModalOpen(false)}
                                    className="flex-1 rounded-xl border-2 border-brown-200 bg-white py-3 font-medium text-brown-900 hover:bg-brown-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-brown-900 py-3 font-medium text-white hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    {editingService ? 'Update Service' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-serif font-bold text-brown-900">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h3>
                            <button
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="text-brown-600 hover:text-brown-900 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Nails & Nail Art"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Category Image URL *
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/photo-.../image.jpg"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                    value={categoryFormData.image}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-brown-600 mt-1">
                                    Use high-quality images from Unsplash or other sources
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Subcategories
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Add subcategory"
                                        className="flex-1 rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                        value={newSubcategory}
                                        onChange={(e) => setNewSubcategory(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubcategory())}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSubcategory}
                                        className="bg-brown-900 text-white px-4 rounded-xl hover:bg-brown-800 transition-colors"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                                    {categoryFormData.subcategories?.map((sub, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-brown-50 p-3 rounded-lg">
                                            <span className="text-brown-900">{sub.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubcategory(idx)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!categoryFormData.subcategories || categoryFormData.subcategories.length === 0) && (
                                        <p className="text-sm text-gray-400 italic">No subcategories added yet</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-brown-900 mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1"
                                    className="w-full rounded-xl border border-brown-200 bg-brown-50/30 p-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-2 focus:ring-brown-900/20 transition-all outline-none"
                                    value={categoryFormData.order}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, order: Number(e.target.value) })}
                                />
                                <p className="text-xs text-brown-600 mt-1">
                                    Lower numbers appear first
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCategoryModalOpen(false)}
                                    className="flex-1 rounded-xl border-2 border-brown-200 bg-white py-3 font-medium text-brown-900 hover:bg-brown-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-brown-900 py-3 font-medium text-white hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesManager;
