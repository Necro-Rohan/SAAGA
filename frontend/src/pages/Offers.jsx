import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Offers = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.public.getOffers();
        setOffers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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

      <div className="max-w-7xl mx-auto px-6 pb-20 pt-0 text-center">
        <div className="relative mb-10 rounded-[2.5rem] overflow-hidden shadow-2xl mx-auto max-w-7xl h-96">
          <div className="absolute inset-0">
            <img
              src="/saaga 3.webp"
              alt="Luxury Spa Background"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brown-900/60 to-brown-900/40 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12">
            <span className="text-xs font-bold tracking-[0.25em] text-white/90 uppercase mb-4 block drop-shadow-sm">
              Exclusive Privileges
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-tight leading-none drop-shadow-md">
              Curated Offers
            </h1>
            <p className="text-white/90 max-w-xl mx-auto text-lg font-light leading-relaxed drop-shadow-sm">
              Seasonal delights and exclusive packages designed for your indulgence.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-brown-200 border-t-brown-900 rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-serif text-brown-400 animate-pulse">
              Loading Privileges...
            </p>
          </div>
        ) : offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-brown-900/5 hover:-translate-y-1 overflow-hidden"
              >
                {/* Decorative Pattern Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brown-50 rounded-bl-[4rem] -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-brown-900 text-white px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm">
                      {offer.type === "percentage" ? `${offer.value}% OFF` : `₹${offer.value} OFF`}
                    </span>
                    {offer.expiryDate && (
                      <span className="text-[10px] font-medium text-brown-400 uppercase tracking-wide bg-cream px-2 py-1 rounded-md">
                        Exp: {new Date(offer.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-brown-900 mb-3 leading-tight group-hover:text-brown-700 transition-colors">
                    {offer.title}
                  </h3>

                  <p className="text-brown-500 text-sm mb-8 leading-relaxed flex-grow font-light border-b border-brown-100 pb-4">
                    {offer.description}
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-brown-400 font-bold mb-1.5">
                        Code
                      </span>
                      <div
                        onClick={() => handleCopy(offer.code, offer._id)}
                        className="group/code cursor-pointer flex items-center gap-2 font-mono text-lg font-bold text-brown-900 tracking-wider hover:text-brown-700 transition-colors"
                      >
                        {offer.code}
                        <span className="text-[10px] bg-brown-50 px-1.5 py-0.5 rounded border border-brown-100 text-brown-400 group-hover/code:bg-brown-100 transition-colors">
                          {copiedId === offer._id ? "COPIED" : "COPY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-12 md:p-20 shadow-xl border border-brown-900/5 relative overflow-hidden max-w-3xl mx-auto">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brown-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-brown-50 rounded-full blur-3xl opacity-50"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-brown-50 rounded-full flex items-center justify-center text-brown-300 mb-6 border border-brown-100">
                <Gift size={32} strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-3xl text-brown-900 mb-3">
                No Active Privileges
              </h2>

              <p className="text-brown-600 max-w-md mx-auto mb-8 leading-relaxed font-light">
                We are currently curating new exclusive experiences for you.
                Please check back soon.
              </p>

              <Link
                to="/services"
                className="group inline-flex items-center gap-2 bg-brown-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm tracking-wide"
              >
                <Sparkles size={18} />
                Explore Menu
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        )}

        <div className="mt-20 text-center border-t border-brown-900/5 pt-12">
          <p className="text-xs text-brown-400 font-bold tracking-[0.2em] uppercase mb-4">
            Stay Updated
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brown-900 hover:text-brown-600 transition-colors font-serif text-xl"
          >
            @saagaa_official
            <ArrowRight size={16} className="-rotate-45" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Offers;
