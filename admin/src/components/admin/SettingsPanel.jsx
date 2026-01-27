import React, { useState } from 'react';
import api from '../../utils/api';

const SettingsPanel = ({ adminUser }) => {
    const [email, setEmail] = useState(adminUser?.email || '');
    const [msg, setMsg] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/api/admin/profile', { email });
            if (res.ok) {
                setMsg('Email updated successfully!');
                // Update local storage if needed, but optimally relaunch auth
            } else {
                setMsg('Failed to update email.');
            }
        } catch (error) {
            console.error(error);
            setMsg('Error updating settings.');
        }
    };

    return (
        <div className="max-w-xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Settings</h2>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Notification Settings</h3>
                <p className="text-gray-500 text-sm mb-6">
                    This email address will receive immediate alerts whenever a new booking is confirmed.
                </p>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Admin Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                        />
                    </div>

                    {msg && <p className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}

                    <button type="submit" className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPanel;
