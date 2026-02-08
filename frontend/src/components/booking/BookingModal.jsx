import { useState, useEffect } from "react";
import api from "../../../utils/api.js";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";

const BookingModal = ({ isOpen, onClose, selectedServices }) => {
  const { login, user, fetchActiveBooking } = useBooking();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Phone/Auth, 3: OTP, 4: Confirm
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Auth State
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setPhone(user?.phone || "");
      setName(user?.name || "");
    }
  }, [isOpen, user]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate ) {
        setAvailableSlots([]); // Clear slots if conditions aren't met
        return;
      }
      setIsLoading(true);
      try {
        // Format Date: YYYY-MM-DD 
        const dateStr = selectedDate.toLocaleDateString("en-CA");

        const serviceIds = selectedServices.length > 0
          ? selectedServices.map((s) => s._id || s.id).join(",")
          : "";
        console.log(`Fetching slots for: ${dateStr}, Services: ${serviceIds}`);

        const res = await api.public.getSlots(dateStr, serviceIds);
        if (res.data && Array.isArray(res.data.slots)) {
          setAvailableSlots(res.data.slots);
        } else {
          console.warn("Invalid slot response:", res.data);
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, selectedServices]);

  if (!isOpen) return null;

  // Calendar Logic 
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

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i,
      );
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected =
        selectedDate && selectedDate.toDateString() === date.toDateString();
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      days.push(
        <button
          key={i}
          disabled={isPast}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isSelected ? "bg-brown-900 text-white" : ""}
                        ${!isSelected && !isPast ? "hover:bg-brown-100 text-brown-900" : ""}
                        ${isToday && !isSelected ? "border border-brown-900 text-brown-900" : ""}
                        ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                    `}
        >
          {i}
        </button>,
      );
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    const now = new Date();
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    if (
      prev.getMonth() >= now.getMonth() ||
      prev.getFullYear() > now.getFullYear()
    ) {
      setCurrentMonth(prev);
    }
  };

  //API Handlers 
  const handleSendOtp = async () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!phone || phone.length < 10)
      return alert("Please enter a valid phone number");
    setIsLoading(true);
    try {
      await api.auth.sendOtp(phone);
      setStep(3); // Go to OTP
    } catch {
      alert("Failed to send OTP. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    setIsLoading(true);
    try {
      const res = await api.auth.verifyOtp(phone, otp, name);
      login({ ...res.data.user, token: res.data.token });
      setStep(4); // Go to Confirm
    } catch {
      alert("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const servicesPayload = selectedServices.length > 0 ? selectedServices.map((s) => ({
        serviceId: s._id || s.id,
        variant: "female", // Defaulting to female for now
      })) : [];
      await api.bookings.create({
        userId: user._id,
        date: selectedDate.toISOString(), 
        timeSlot: selectedTime,
        services: servicesPayload,
        products: [],
        staffId: null,
      });

      alert("Booking Confirmed Successfully!");
      fetchActiveBooking();
      onClose();
    } catch (err) {
      alert("Booking Failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brown-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-cream px-6 py-4 flex justify-between items-center border-b border-brown-900/5">
          <h2 className="font-serif text-2xl text-brown-900">
            {step === 1
              ? "Schedule Visit"
              : step === 2
                ? "Login"
                : step === 3
                  ? "Verify"
                  : "Confirm"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brown-900/5 rounded-full text-brown-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8">
              {/* Calendar Section */}
              <div>
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-sm font-bold text-brown-900 uppercase tracking-wider flex items-center gap-2">
                    <CalendarIcon size={16} /> Select Date
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevMonth}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium w-24 text-center">
                      {currentMonth.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span
                      key={d}
                      className="text-xs font-medium text-gray-400 w-10 text-center"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 place-items-center">
                  {generateCalendar()}
                </div>
              </div>

              {/* Time Section */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.length > 0 ? (
                  availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${selectedTime === time ? "bg-brown-900 text-white" : ""}`}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <p className="col-span-4 text-center text-sm text-gray-400">
                    No slots available for this date.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors mb-4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label className="block text-xs font-bold text-brown-900 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-400 font-serif">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 transition-all shadow-lg"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <p className="text-brown-600">
                Enter the OTP sent to +91 {phone}
              </p>
              <input
                type="text"
                placeholder="••••"
                maxLength={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brown-900 focus:ring-0 outline-none transition-colors text-center text-2xl tracking-[0.5em] font-serif"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 transition-all shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-brown-500 underline"
              >
                Change Number
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="bg-cream p-4 rounded-xl border border-brown-900/10">
                <span className="text-md font-serif text-brown-900 block mb-2">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((s) => (
                    <span
                      key={s.name}
                      className="px-2 py-1 bg-white rounded-md text-xs text-brown-800 border border-brown-900/5"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="w-full py-3 bg-green-700 text-white rounded-full font-medium hover:bg-green-800 disabled:opacity-50 transition-all shadow-lg"
              >
                {isLoading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions (Only for Step 1) */}
        {step === 1 && (
          <div className="p-6 bg-white border-t border-gray-100">
            <button
              disabled={!selectedDate}
              onClick={() => {
                if (user) setStep(4);
                else setStep(2);
              }}
              className="w-full px-6 py-3 bg-brown-900 text-white rounded-full font-medium hover:bg-brown-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
