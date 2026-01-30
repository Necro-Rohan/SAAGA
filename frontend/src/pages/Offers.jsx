import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Offers = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/public/offers`);
        setOffers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

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

      <div className="max-w-4xl mx-auto px-6 pb-20 pt-10 text-center">
        <div className="mb-16 animate-fade-in">
          <span className="text-xs font-bold tracking-[0.2em] text-brown-400 uppercase mb-4 block">
            Exclusive Deals
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-brown-900 mb-6 tracking-tight">
            Special Offers
          </h1>
          <p className="text-brown-600 max-w-lg mx-auto text-lg font-light leading-relaxed">
            Curated packages and seasonal delights designed to pamper you.
          </p>
        </div>

        {loading ? (
          <p className="text-xl font-serif text-brown-400 animate-pulse">
            Loading Offers...
          </p>
        ) : offers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-[2rem] p-8 shadow-xl border border-brown-900/5 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-brown-400 uppercase bg-brown-50 px-3 py-1 rounded-full">
                    Limited Time
                  </span>
                  {offer.expiryDate && (
                    <span className="text-xs font-medium text-red-400">
                      Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl text-brown-900 mb-2">
                  {offer.title}
                </h3>
                <p className="text-brown-600 mb-6 font-light leading-relaxed">
                  {offer.description}
                </p>

                <div className="border-t border-brown-100 pt-6 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-brown-400 font-bold mb-1">
                      Use Code
                    </span>
                    <span className="font-mono text-xl font-bold text-brown-900 tracking-wider bg-brown-50 px-4 py-2 rounded-lg border border-dashed border-brown-300">
                      {offer.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-serif text-brown-900">
                      {offer.type === "percentage"
                        ? `${offer.value}%`
                        : `₹${offer.value}`}
                    </span>
                    <span className="text-xs text-brown-500 uppercase tracking-wider font-bold">
                      OFF
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-12 md:p-20 shadow-xl border border-brown-900/5 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brown-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-brown-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-brown-50 rounded-full flex items-center justify-center text-brown-300 mb-8 border border-brown-100">
                <Gift size={40} strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-brown-900 mb-4">
                No Active Offers Currently
              </h2>

              <p className="text-brown-600 max-w-md mx-auto mb-10 leading-relaxed">
                We are currently curating new exclusive experiences for you.
                Please check back soon or explore our standard service menu for
                luxurious treatments.
              </p>

              <Link
                to="/services"
                className="group inline-flex items-center gap-2 bg-brown-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Sparkles size={18} />
                Explore Services
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-brown-500 font-medium tracking-wide uppercase mb-4">
            Stay Updated
          </p>
          <p className="text-brown-900 opacity-60">
            Follow us on Instagram{" "}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brown-700 decoration-brown-300"
            >
              @saagaa_official
            </a>{" "}
            for flash sales and updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Offers;
