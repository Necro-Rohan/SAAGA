import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Link } from 'react-router-dom';

const Navbar = ({ showLogo = false, onOpenBooking }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className={`flex justify-between md:justify-center items-center py-4 md:py-6 w-full max-w-full z-50 ${showLogo ? 'border-b border-brown-900/10' : ''}`}>

            {/* Mobile Logo/Brand */}
            <Link to="/" className="md:hidden font-serif text-2xl text-brown-900">
                SAAGAA
            </Link>

            {/* Desktop Menu */}
            <div className={`hidden md:flex items-center w-full ${showLogo ? 'justify-between' : 'justify-center gap-16 lg:gap-24'}`}>

                {showLogo && (
                    <Link to="/" className="font-serif text-3xl font-bold text-brown-900 tracking-widest">
                        SAAGAA
                    </Link>
                )}

                <div className={`flex items-center ${showLogo ? 'gap-12' : 'gap-16 lg:gap-24'}`}>
                    <Link to="/services" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">services</Link>
                    <Link to="/shop" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">shop</Link>
                    <Link to="/offers" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">offers</Link>
                    <a href="/#locate" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">locate us</a>
                    <Link to="/schedule" className="px-8 py-3 text-base text-brown-900 font-medium tracking-[0.5px] border border-brown-600 rounded-full hover:bg-brown-600 hover:text-white transition-all duration-300">
                        Schedule Visit
                    </Link>
                </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
                className="md:hidden text-brown-900 p-2"
                onClick={() => setIsMenuOpen(true)}
            >
                <Menu size={28} />
            </button>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#FAF9F6] z-50 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <button
                    className="absolute top-6 right-6 text-brown-900 p-4"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <X size={32} />
                </button>

                <div className="flex flex-col gap-8 text-center">
                    <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Services</a>
                    <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Shop</Link>
                    <Link to="/offers" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Offers</Link>
                    <a href="#locate" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Locate Us</a>
                    <Link
                        to="/schedule"
                        onClick={() => setIsMenuOpen(false)}
                        className="mt-4 px-10 py-4 text-lg text-brown-900 border border-brown-900 rounded-full"
                    >
                        Schedule Visit
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
