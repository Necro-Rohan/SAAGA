import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import BookingModal from '../components/booking/BookingModal';
import { Calendar, Clock, MapPin, Phone, User, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

const Schedule = () => {
    const [appointment, setAppointment] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('saaga_appointment');
        if (saved) {
            setAppointment(JSON.parse(saved));
        }
    }, [isBookingOpen]); // Reload when booking modal closes (in case of new booking)

    return (
        <div className="min-h-screen bg-cream text-brown-900 font-sans">
             <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col">
                <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
                <div className="w-full h-px bg-beige-300 mb-8 md:mb-12"></div>
            </div>

            <BookingModal 
                isOpen={isBookingOpen} 
                onClose={() => setIsBookingOpen(false)}
                selectedServices={[]} 
            />

            <div className="max-w-3xl mx-auto px-6 pb-20">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl text-brown-900 mb-4">Your Visits</h1>
                    <p className="text-brown-600">Manage your upcoming appointments at SAAGAA.</p>
                </div>

                {appointment ? (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-brown-900/5 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brown-400 to-brown-900"></div>
                        
                        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-8 border-b border-brown-900/10 pb-8">
                            <div>
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wider uppercase mb-3 inline-block">
                                    Confirmed
                                </span>
                                <h2 className="text-2xl font-serif text-brown-900">
                                    Upcoming Appointment
                                </h2>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm text-brown-500">Booking Reference</p>
                                <p className="font-mono text-lg text-brown-900">#SAG-{Math.floor(Math.random() * 10000)}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brown-50 flex items-center justify-center text-brown-900 shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">Date</p>
                                        <p className="text-lg font-medium text-brown-900">{appointment.date}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brown-50 flex items-center justify-center text-brown-900 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">Time</p>
                                        <p className="text-lg font-medium text-brown-900">{appointment.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brown-50 flex items-center justify-center text-brown-900 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brown-400 uppercase tracking-wider mb-1">Guest</p>
                                        <p className="text-lg font-medium text-brown-900">{appointment.name}</p>
                                        {appointment.phone && <p className="text-sm text-brown-600 mt-1">{appointment.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-cream/50 rounded-2xl p-6">
                                <h3 className="flex items-center gap-2 font-serif text-lg text-brown-900 mb-6 border-b border-brown-900/10 pb-4">
                                    <Scissors size={18} /> Services
                                </h3>
                                <div className="space-y-3">
                                    {appointment.services && appointment.services.length > 0 ? (
                                        appointment.services.map((service, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brown-400"></div>
                                                <span className="text-brown-800">{service}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-brown-500 italic">No specific services selected</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-brown-900/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex items-center gap-2 text-brown-600 text-sm">
                                <MapPin size={16} />
                                <span>SAAGAA Unisex Salon & Spa, Gomti Nagar</span>
                            </div>
                            <button 
                                onClick={() => {
                                    localStorage.removeItem('saaga_appointment');
                                    setAppointment(null);
                                }}
                                className="text-red-500 text-sm hover:text-red-700 font-medium transition-colors"
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-brown-300">
                        <div className="w-16 h-16 bg-brown-50 text-brown-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar size={32} />
                        </div>
                        <h3 className="font-serif text-2xl text-brown-900 mb-2">No Upcoming Visits</h3>
                        <p className="text-brown-600 mb-8 max-w-sm mx-auto">You haven't scheduled any appointments with us yet. Book your session to experience luxury.</p>
                        <button 
                            onClick={() => setIsBookingOpen(true)}
                            className="bg-brown-900 text-white px-8 py-3 rounded-full font-medium hover:bg-brown-800 transition-colors shadow-lg"
                        >
                            Book Appointment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schedule;
