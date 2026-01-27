import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import api from '../../utils/api';

const BookingsView = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.bookings.getAll();
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-800">All Appointment Bookings</h2>

            {bookings.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No bookings found yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="rounded-xl border bg-white p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${booking.status === 'booked' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <span>#{booking._id.slice(-6).toUpperCase()}</span>
                                    </div>

                                    <div className="mt-2 flex items-center space-x-6">
                                        <div className="flex items-center text-gray-700">
                                            <User className="mr-2 h-4 w-4" />
                                            {/* Backend populates 'userId', not 'user' */}
                                            <span className="font-semibold">{booking.userId?.name || booking.userId?.phone || 'Unknown User'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Phone className="mr-2 h-4 w-4" />
                                            <span>{booking.userId?.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:text-right">
                                    <div className="flex items-center justify-end text-gray-700">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>{formatDate(booking.date)}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-end text-gray-700">
                                        <Clock className="mr-2 h-4 w-4" />
                                        <span className="font-bold">{booking.timeSlot}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-900">Items (Services & Products)</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                    {booking.services.map((svc, idx) => (
                                        <li key={`svc-${idx}`} className="flex justify-between">
                                            {/* Access nested serviceId and handle nulls */}
                                            <span>{svc.serviceId?.name || "Deleted Service"} ({svc.variant})</span>
                                            {/* Price is not stored in appointment service item currently, defaulting to N/A or removing */}
                                            {/* <span>₹{svc.price}</span> -- Price is missing in mismatch */}
                                        </li>
                                    ))}
                                    {booking.products.map((prd, idx) => (
                                        <li key={`prd-${idx}`} className="flex justify-between">
                                            <span>{prd.name} (Product)</span>
                                            <span>₹{prd.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 flex justify-between border-t border-dashed pt-2 font-bold text-gray-900">
                                    <span>Total Amount</span>
                                    <span>₹{booking.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookingsView;
