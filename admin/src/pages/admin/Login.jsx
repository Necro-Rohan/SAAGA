import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store both token and user in localStorage
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed'); // backend sends 'message'
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream selection:bg-brown-900 selection:text-white">
            <div className="w-full max-w-md space-y-8 p-8">
                <div className="text-center">
                    <h1 className="text-5xl font-serif text-brown-900 mb-2">SAAGAA</h1>
                    <p className="text-brown-600 font-sans tracking-wide">Admin Control Center</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-brown-900/5 border border-brown-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brown-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="block w-full rounded-xl border-brown-200 bg-brown-50/50 px-4 py-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-brown-900 transition-all"
                                    placeholder="admin@saagaa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brown-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="block w-full rounded-xl border-brown-200 bg-brown-50/50 px-4 py-3 text-brown-900 placeholder-brown-400 focus:border-brown-900 focus:ring-brown-900 transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-brown-900 px-4 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brown-800 focus:outline-none focus:ring-2 focus:ring-brown-900 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5"
                        >
                            Sign in to Dashboard
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
