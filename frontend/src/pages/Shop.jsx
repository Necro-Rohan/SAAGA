import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Shop = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.public.getShopProducts();
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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

      <div className="max-w-7xl mx-auto px-6 pb-20 pt-10 text-center">
        <div className="mb-16 animate-fade-in">
          <span className="text-xs font-bold tracking-[0.2em] text-brown-400 uppercase mb-4 block">
            SAAGAA Essentials
          </span>
          <h1 className="font-serif text-5xl md:text-7xl text-brown-900 mb-6 tracking-tight">
            The Shop
          </h1>
          <p className="text-brown-600 max-w-lg mx-auto text-lg font-light leading-relaxed">
            Premium haircare and skincare products recommended by our experts.
          </p>
        </div>

        {loading ? (
          <p className="text-xl font-serif text-brown-400 animate-pulse">
            Loading Collection...
          </p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-brown-900/5 hover:-translate-y-2"
              >
                <div className="h-80 bg-[#F5F5F0] rounded-[1.5rem] mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/5 transition-colors duration-500"></div>
                  <img
                    src="/hair_service.png"
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Quick Add Button or Badge */}
                  <div className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <button className="bg-white text-brown-900 p-3 rounded-full shadow-lg hover:bg-brown-900 hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
                <div className="px-2">
                  <span className="text-xs font-bold tracking-[0.15em] text-brown-400 uppercase mb-2 block">
                    Premium Care
                  </span>
                  <h3 className="font-serif text-2xl text-brown-900 mb-3 leading-tight group-hover:text-brown-700 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-end border-t border-brown-100 pt-4 mt-4">
                    <div>
                      <p className="font-serif text-xl text-brown-900">
                        ₹{product.price}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.stock > 0
                          ? "bg-brown-50 text-brown-800 border border-brown-100"
                          : "bg-red-50 text-red-800 border border-red-100"
                        }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Sold Out"}
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
                <ShoppingBag size={40} strokeWidth={1.5} />
              </div>

              <h2 className="font-serif text-3xl md:text-4xl text-brown-900 mb-4">
                Collection Coming Soon
              </h2>

              <p className="text-brown-600 max-w-md mx-auto mb-10 leading-relaxed">
                We are currently curating an exclusive selection of professional
                products for your home care regimen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-2 bg-brown-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Explore Services
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
