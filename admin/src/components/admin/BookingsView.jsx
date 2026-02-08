import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Phone, Loader2 } from "lucide-react";
import api from "../../utils/api";

const BookingsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const sections = [
    { key: "pending", title: "⏳ Pending Requests", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
    { key: "confirmed", title: "✅ Confirmed Appointments", color: "text-green-700 bg-green-50 border-green-200" },
    { key: "completed", title: "🎉 Completed Visits", color: "text-blue-700 bg-blue-50 border-blue-200" },
    { key: "cancelled", title: "❌ Cancelled", color: "text-red-700 bg-red-50 border-red-200" },
    { key: "noshow", title: "🚫 No Show", color: "text-gray-700 bg-gray-50 border-gray-200" },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.bookings.getAll();
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  
  const BookingCard = ({ booking }) => (
    <div key={booking._id} className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                booking.status === "confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : booking.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status}
            </span>
            <span>#{booking._id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="mt-2 flex items-center space-x-6">
            <div className="flex items-center text-gray-700">
              <User className="mr-2 h-4 w-4" />
              <span className="font-semibold">
                {booking.userId?.name || booking.userId?.phone || "Unknown User"}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="mr-2 h-4 w-4" />
              <span>{booking.userId?.phone || "N/A"}</span>
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
              <span>
                {svc.serviceId?.name || "Deleted Service"} ({svc.variant})
              </span>
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
  );

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">All Appointment Bookings</h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No bookings found yet.</div>
      ) : (
        <div className="space-y-10">
          {sections.map((section) => {
            // Filter bookings for the current section
            const sectionBookings = bookings.filter((b) => b.status === section.key);

            // Only render the section if there are bookings
            if (sectionBookings.length === 0) return null;

            return (
              <div key={section.key} className={`p-4 rounded-2xl border ${section.color} bg-opacity-30`}>
                <h3 className="text-xl font-bold mb-4 opacity-90">{section.title}</h3>
                <div className="space-y-4">
                  {sectionBookings.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsView;
