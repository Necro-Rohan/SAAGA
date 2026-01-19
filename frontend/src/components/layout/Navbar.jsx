import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between md:justify-center items-center py-6 md:py-10 w-full px-6 relative z-50">

            {/* Mobile Logo/Brand (Optional, if needed for mobile left alignment) */}
            <div className="md:hidden font-serif text-2xl text-brown-900">
                SAAGAA
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-16 lg:gap-24 items-center justify-center w-full">
                <a href="#services" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">services</a>
                <a href="#shop" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">shop</a>
                <a href="#offers" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">offers</a>
                <a href="#locate" className="text-brown-900 text-base font-normal tracking-[0.5px] hover:opacity-80 transition-opacity">locate us</a>
                <a href="#schedule" className="px-8 py-3 text-base text-brown-900 font-medium tracking-[0.5px] border border-brown-600 rounded-full hover:bg-brown-600 hover:text-white transition-all duration-300">
                    Schedule Visit
                </a>
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
                    <a href="#shop" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Shop</a>
                    <a href="#offers" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Offers</a>
                    <a href="#locate" onClick={() => setIsMenuOpen(false)} className="text-brown-900 text-3xl font-serif">Locate Us</a>
                    <a href="#schedule" onClick={() => setIsMenuOpen(false)} className="mt-4 px-10 py-4 text-lg text-brown-900 border border-brown-900 rounded-full">
                        Schedule Visit
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
