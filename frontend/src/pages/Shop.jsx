import { useState, useEffect } from "react";
import api from "../../utils/api.js";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import { ShoppingBag, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Shop = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const productCategory = product.category || "Uncategorized";
    const matchesCategory =
      selectedCategory === "All" || productCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      {/* Navbar Section - Restored Original Structure */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col">
        <Navbar showLogo={true} onOpenBooking={() => setIsBookingOpen(true)} />
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={[]}
      />

      {/* Hero Section with Background Image - 50vh */}
      <div className="relative w-full h-[50vh] min-h-[500px] mb-16 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/saaga1.webp"
            alt="Shop Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-6">
          <div className="animate-fade-in-up w-full max-w-4xl">
            <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-white/90 uppercase mb-4 block drop-shadow-md">
              SAAGAA Essentials
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight drop-shadow-lg">
              The Shop
            </h1>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/70 group-focus-within:text-white transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full leading-5 placeholder-white/60 text-white focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-4 focus:ring-white/10 transition-all shadow-lg hover:bg-white/15"
                placeholder="Search for perfection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up delay-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${selectedCategory === cat
                      ? "bg-white text-brown-900 border-white shadow-lg transform scale-105"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brown-200 border-t-brown-900"></div>
            <p className="mt-4 text-xl font-serif text-brown-400">
              Loading Collection...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-brown-900/5 hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="h-80 bg-[#F5F5F0] rounded-[1.5rem] mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/5 transition-colors duration-500 z-10"></div>
                  <img
                    src={product.image || "/saagawatermark.png"}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/saagawatermark.png";
                    }}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  {/* Quick Add Button or Badge */}
                  <div className="absolute bottom-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 z-20">
                    <button className="bg-white text-brown-900 p-3 rounded-full shadow-lg hover:bg-brown-900 hover:text-white transition-colors">
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </div>
                <div className="px-2 flex flex-col flex-grow">
                  {product.category && (
                    <span className="text-xs font-bold tracking-[0.15em] text-brown-400 uppercase mb-2 block">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-serif text-2xl text-brown-900 mb-3 leading-tight group-hover:text-brown-700 transition-colors">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-brown-100 flex justify-between items-end">
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
          <div className="py-24 text-center bg-white/50 rounded-[2rem] border border-brown-100/50 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="text-brown-200 mb-6 flex justify-center">
              <Search size={64} strokeWidth={1} />
            </div>
            <h3 className="text-3xl font-serif text-brown-900 mb-4">
              {products.length === 0 ? "Collection Coming Soon" : "No matches found"}
            </h3>
            <p className="text-brown-500 mb-8 max-w-md mx-auto leading-relaxed">
              {products.length === 0
                ? "We are currently curating an exclusive selection of professional products for your home care regimen."
                : "We couldn't find any products matching your search criteria. Try a different keyword or category."}
            </p>
            {products.length > 0 ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="px-8 py-3 bg-brown-900 text-white rounded-full hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 font-medium text-sm tracking-wide"
              >
                Clear Filters
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-2 bg-brown-900 text-white px-8 py-3 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Explore Services
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
