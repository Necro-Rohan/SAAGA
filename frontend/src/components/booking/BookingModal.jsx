import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, selectedServices }) => {
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Info
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    // User Details
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        notes: ''
    });

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedDate(null);
            setSelectedTime(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Calendar Logic ---
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        // Days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            const isPast = date < new Date().setHours(0,0,0,0);

            days.push(
                <button
                    key={i}
                    disabled={isPast}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isSelected ? 'bg-brown-900 text-white' : ''}
                        ${!isSelected && !isPast ? 'hover:bg-brown-100 text-brown-900' : ''}
                        ${isToday && !isSelected ? 'border border-brown-900 text-brown-900' : ''}
                        ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                    `}
                >
                    {i}
                </button>
            );
        }
        return days;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        const now = new Date();
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        if (prev.getMonth() >= now.getMonth() || prev.getFullYear() > now.getFullYear()) {
             setCurrentMonth(prev);
        }
    };

    // --- Time Slots ---
    const timeSlots = [
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
        "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
        "06:00 PM", "06:30 PM", "07:00 PM"
    ];

    // --- Final Booking ---
    const handleConfirm = () => {
        // Validation
        if (!selectedDate || !selectedTime || !formData.name) return;
        
        // precise 10 digit validation
        const phoneRegex = /^\d{10}$/;
        // Remove spaces/dashes before checking
        const cleanPhone = formData.phone.replace(/[\s-]/g, '');
        
        if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
             alert("Please enter a valid 10-digit phone number.");
             return;
        }

        const dateStr = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const servicesList = selectedServices.map(s => s.name).join(', ');
        
        // Save to LocalStorage
        const bookingDetails = {
            name: formData.name,
            phone: cleanPhone,
            date: dateStr,
            time: selectedTime,
            services: selectedServices.map(s => s.name),
            status: 'confirmed', // Optimistic UI
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('saaga_appointment', JSON.stringify(bookingDetails));

        // WhatsApp Redirect
        const message = `*New Appointment Request*\n\n` +
            `*Name:* ${formData.name}\n` +
            `*Date:* ${dateStr}\n` +
            `*Time:* ${selectedTime}\n` +
            `*Services:* ${servicesList}\n` +
            `*Notes:* ${formData.notes || 'None'}`;

        const phoneNumber = "919112157691";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Open WA in new tab
        window.open(url, '_blank');
        
        // Close modal and refresh/notify parent if needed
        onClose();
        // Force reload or event dispatch could go here if Schedule page needs it immediately, 
        // but Schedule.jsx listens to storage or mount. 
        // For smoother UX, we might want to navigate to /schedule or just close.
        // Assuming current behavior is just close.
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brown-900/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-cream px-6 py-4 flex justify-between items-center border-b border-brown-900/5">
                    <h2 className="font-serif text-2xl text-brown-900">
                        {step === 1 ? 'Schedule Visit' : 'Confirm Details'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-brown-900/5 rounded-full text-brown-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {step === 1 ? (
                        <div className="space-y-8">
                            {/* Calendar Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h3 className="text-sm font-bold text-brown-900 uppercase tracking-wider flex items-center gap-2">
                                        <CalendarIcon size={16} /> Select Date
                                    </h3>
                                    <div className="flex gap-2">
                                        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={18} /></button>
                                        <span className="text-sm font-medium w-24 text-center">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={18} /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 place-items-center mb-2">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <span key={d} className="text-xs font-medium text-gray-400 w-10 text-center">{d}</span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1 place-items-center">
                                    {generateCalendar()}
                                </div>
                            </div>

                            {/* Time Section */}
                            <div>
                                <h3 className="text-sm font-bold text-brown-900 uppercase tracking-wider flex items-center gap-2 mb-4">
                                    <Clock size={16} /> Select Time
                                </h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {timeSlots.map(time => (
                                        <button
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            disabled={!selectedDate}
                                            className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all
                                                ${selectedTime === time 
                                                    ? 'bg-brown-900 text-white border-brown-900' 
                                                    : 'border-brown-900/10 text-brown-700 hover:border-brown-900/30'}
                                                ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Selected Info Summary */}
                            <div className="bg-cream p-4 rounded-xl border border-brown-900/10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-md font-serif text-brown-900">
                                        {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} at {selectedTime}
                                    </span>
                                    <button onClick={() => setStep(1)} className="text-xs text-brown-600 underline">Change</button>
                                </div>
                                <div className="border-t border-brown-900/10 my-2"></div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {selectedServices.map(s => (
                                        <span key={s.name} className="px-2 py-1 bg-white rounded-md text-xs text-brown-800 border border-brown-900/5">
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* User Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">Your Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Rahul Gupta"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                                    <input 
                                        type="tel" 
                                        placeholder="e.g. +91 98765 43210"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
                    {step === 2 && (
                        <button 
                            onClick={() => setStep(1)}
                            className="flex-1 px-6 py-3 border border-brown-900 rounded-full text-brown-900 font-medium hover:bg-brown-50 transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button 
                        disabled={step === 1 ? (!selectedDate || !selectedTime) : !formData.name}
                        onClick={() => step === 1 ? setStep(2) : handleConfirm()}
                        className="flex-[2] px-6 py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brown-900/20"
                    >
                        {step === 1 ? 'Continue' : 'Confirm via WhatsApp'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
