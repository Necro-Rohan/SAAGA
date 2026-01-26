import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, ShoppingBag, Tag, Settings, LogOut } from 'lucide-react';

// Sections
import BookingsView from '../../components/admin/BookingsView';
import ServicesManager from '../../components/admin/ServicesManager';
import ShopManager from '../../components/admin/ShopManager';
import OffersManager from '../../components/admin/OffersManager';
import SettingsPanel from '../../components/admin/SettingsPanel';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const navigate = useNavigate();
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('adminUser');
        if (!user) {
            navigate('/login');
        } else {
            setAdminUser(JSON.parse(user));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'bookings': return <BookingsView />;
            case 'services': return <ServicesManager />;
            case 'shop': return <ShopManager />;
            case 'offers': return <OffersManager />;
            case 'settings': return <SettingsPanel adminUser={adminUser} />;
            default: return <BookingsView />;
        }
    };

    const NavButton = ({ tab, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex w-full items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${activeTab === tab
                ? 'bg-brown-900 text-white shadow-lg shadow-brown-900/20 translate-x-1'
                : 'text-brown-600 hover:bg-brown-100 hover:text-brown-900'
                }`}
        >
            <Icon className={`mr-3 h-5 w-5 ${activeTab === tab ? 'text-white' : 'text-brown-400'}`} />
            <span className="tracking-wide">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-cream selection:bg-brown-900 selection:text-white">
            {/* Sidebar */}
            <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-brown-100 flex flex-col">
                <div className="h-24 flex items-center justify-center border-b border-brown-100/50">
                    <h1 className="text-3xl font-serif text-brown-900 tracking-tight">SAAGAA</h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <p className="px-4 text-xs font-bold text-brown-400 uppercase tracking-widest mb-4">Main Menu</p>
                    <NavButton tab="bookings" icon={Calendar} label="Bookings" />
                    <NavButton tab="services" icon={Package} label="Services" />
                    <NavButton tab="shop" icon={ShoppingBag} label="Shop Inventory" />
                    <NavButton tab="offers" icon={Tag} label="Offers & Coupons" />

                    <div className="my-8 border-t border-brown-100/50"></div>

                    <p className="px-4 text-xs font-bold text-brown-400 uppercase tracking-widest mb-4">System</p>
                    <NavButton tab="settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t border-brown-100/50">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-cream">
                <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-brown-900/5 bg-cream/80 px-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-serif text-brown-900">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </h2>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-brown-100">
                        <div className="h-8 w-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-900 font-serif font-bold">
                            {adminUser?.name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm font-medium text-brown-900">{adminUser?.name || 'Admin'}</span>
                    </div>
                </header>

                <main className="p-8 mx-auto max-w-7xl animate-fade-in">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
