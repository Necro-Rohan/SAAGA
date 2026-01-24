import { useState, useEffect } from 'react';
import { servicesData } from '../constants/servicesData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import waxImage from '../assets/wax_service.png';
import facialImage from '../assets/facial_service.png';

const ServicesFull = () => {
    const [activeCategory, setActiveCategory] = useState(servicesData[0].id);

    // Map categories to images (cycling through available ones if needed)
    const categoryImages = {
        "nails": "/Nails.jpg",
        "hair-his": "/Hairs.jpg",
        "hair-her": "/Hairs.jpg",
        "styling-her": "/Hairs.jpg",
        "shampoo": "/Hairs.jpg", // Placeholder
        "head-massage": "/Hairs.jpg", // Placeholder
        "texture": "/Hairs.jpg", // Placeholder
        "hair-treatments": "/Hairs.jpg", // Placeholder
        "hair-spa": "/Hairs.jpg", // Placeholder
        "hair-color": "/Hairs.jpg", // Placeholder
        "skin": facialImage,
        "wax": waxImage,
        "threading": facialImage, // Placeholder
        "bleach": facialImage, // Placeholder
        "body": waxImage, // Placeholder
        "hands-feet": "/Nails.jpg",
        "lashes": "/Eyelashes.png",
        "his-packages": "/Hairs.jpg",
        "her-packages": "/Hairs.jpg"
    };


    const scrollToCategory = (id) => {
        setActiveCategory(id);
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 250;
            for (const service of servicesData) {
                const element = document.getElementById(service.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(service.id);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBook = (serviceName) => {
        const phoneNumber = "919112157691";
        const message = `Hi, I would like to book an appointment for ${serviceName}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-cream text-brown-900 font-sans selection:bg-brown-900 selection:text-white">
            <div className="bg-cream">
                <Navbar showLogo={true} />
            </div>

            <div className="pt-10 pb-16 text-center px-4">
                <span className="text-xs font-semibold tracking-[0.3em] text-brown-400 uppercase mb-4 block animate-fade-in font-sans">
                    Experience the art of refined beauty
                </span>
                <h1 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight font-medium">
                    Services We Offer
                </h1>
                <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
            </div>

            <main className="max-w-[1440px] mx-auto px-4 md:px-10 pb-20 flex flex-col md:flex-row gap-12">
                <aside className="hidden md:block w-72 shrink-0">
                    <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide py-4 pr-2">
                        <nav className="flex flex-col gap-1">
                            {servicesData.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => scrollToCategory(service.id)}
                                    className={`text-left px-5 py-3 rounded-xl text-sm tracking-wide transition-all duration-300 font-medium border border-transparent ${
                                        activeCategory === service.id 
                                            ? 'bg-brown-900 text-white shadow-lg translate-x-2' 
                                            : 'text-brown-700 hover:bg-brown-900/5 hover:border-brown-900/10'
                                    }`}
                                >
                                    {service.category}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="md:hidden sticky top-0 bg-cream z-40 py-4 -mx-4 px-4 border-b border-brown-900/5 overflow-x-auto scrollbar-hide shadow-sm">
                     <div className="flex gap-2">
                        {servicesData.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => scrollToCategory(service.id)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold tracking-wide border transition-all duration-300 ${
                                    activeCategory === service.id
                                        ? 'bg-brown-900 text-white border-brown-900 shadow-md'
                                        : 'bg-white border-brown-900/10 text-brown-700'
                                }`}
                            >
                                {service.category}
                            </button>
                        ))}
                     </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-24">
                        {servicesData.map((service) => (
                            <section key={service.id} id={service.id} className="scroll-mt-32">
                                <div className="mb-10 rounded-3xl overflow-hidden relative h-48 md:h-64 shadow-xl">
                                    <img 
                                        src={categoryImages[service.id] || "/Hairs.jpg"} 
                                        alt={service.category} 
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                        <h2 className="font-serif text-3xl md:text-5xl text-white text-center px-4 tracking-wide shadow-black drop-shadow-lg">
                                            {service.category}
                                        </h2>
                                    </div>
                                </div>

                                {service.items && (
                                    <div className="divide-y divide-brown-900/10">
                                        {service.items.map((item, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 group hover:bg-brown-900/5 px-4 rounded-xl transition-all duration-300">
                                                <div className="mb-4 sm:mb-0">
                                                    <h3 className="text-large font-medium text-brown-900 group-hover:translate-x-1 transition-transform">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                    <span className="text-xl font-serif text-brown-600">
                                                        {item.price ? `₹ ${item.price}` : ''}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleBook(item.name)}
                                                        className="px-6 py-2 bg-transparent border border-brown-900 text-brown-900 text-xs tracking-wider uppercase font-bold rounded-full hover:bg-brown-900 hover:text-white transition-all duration-300"
                                                    >
                                                        Book
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {service.subsections && (
                                    <div className="flex flex-col gap-12 mt-8">
                                        {service.subsections.map((sub, idx) => (
                                            <div key={idx}>
                                                <h3 className="font-serif text-2xl text-brown-800 mb-6 pl-4 border-l-4 border-brown-900">
                                                    {sub.title}
                                                </h3>
                                                <div className="divide-y divide-brown-900/10 bg-white rounded-2xl p-4 shadow-sm border border-brown-900/5">
                                                    {sub.items.map((item, itemIdx) => (
                                                        <div key={itemIdx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 group hover:pl-2 transition-all">
                                                            <span className="text-brown-900 font-medium text-lg w-full sm:w-auto mb-2 sm:mb-0">
                                                                {item.name}
                                                            </span>
                                                            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                                <span className="text-brown-600 font-serif text-lg">
                                                                    {item.price ? `₹ ${item.price}` : ''}
                                                                </span>
                                                                <button 
                                                                    onClick={() => handleBook(item.name)}
                                                                    className="px-5 py-2 bg-brown-50 text-brown-900 text-xs tracking-wider uppercase font-bold rounded-full hover:bg-brown-900 hover:text-white transition-all duration-300"
                                                                >
                                                                    Book
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ServicesFull;
