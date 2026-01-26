import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BookingModal from '../components/booking/BookingModal';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Shop = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

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
                        SAAGAA Essentials
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-brown-900 mb-6 tracking-tight">
                        The Shop
                    </h1>
                    <p className="text-brown-600 max-w-lg mx-auto text-lg font-light leading-relaxed">
                        Premium haircare and skincare products recommended by our experts.
                    </p>
                </div>

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
                            We are currently curating an exclusive selection of professional products for your home care regimen.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/services"
                                className="group inline-flex items-center justify-center gap-2 bg-brown-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brown-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                            >
                                Explore Services
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
