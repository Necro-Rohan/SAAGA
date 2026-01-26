import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ services: [], products: [] });
  const [activeBooking, setActiveBooking] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("saaga_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const fetchActiveBooking = async () => {
    if (!user?._id || !user?.token) {
      setActiveBooking(null);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5001/api/bookings/my-bookings",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      const bookings = res.data;

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const active = bookings.find((b) => {
        const bookingDate = new Date(b.date);
        const isActiveStatus =
          b.status !== "cancelled" && b.status !== "completed";
        // Also check if it's in the future or today
        const isFuture = bookingDate >= now;

        return isActiveStatus && isFuture;
      });

      setActiveBooking(active || null);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActiveBooking();
    } else {
      setActiveBooking(null);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("saaga_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("saaga_user");
    setActiveBooking(null);
  };

  const addToCart = (item, type = "service") => {
    setCart((prev) => ({
      ...prev,
      [type === "service" ? "services" : "products"]: [
        ...prev[type === "service" ? "services" : "products"],
        item,
      ],
    }));
  };

  const removeFromCart = (itemId, type = "service") => {
    setCart((prev) => ({
      ...prev,
      [type === "service" ? "services" : "products"]: prev[
        type === "service" ? "services" : "products"
      ].filter((i) => (i._id || i.id) !== itemId),
    }));
  };

  const clearCart = () => {
    setCart({ services: [], products: [] });
  };

  return (
    <BookingContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        activeBooking,
        fetchActiveBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
