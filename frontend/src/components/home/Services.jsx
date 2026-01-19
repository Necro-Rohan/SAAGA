import hairImage from '../../assets/hair_service.png';
import nailImage from '../../assets/nail_service.png';
import waxImage from '../../assets/wax_service.png';
import facialImage from '../../assets/facial_service.png';
import lashesImage from '../../assets/lashes_service.png';
import { ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ service, className }) => (
    <div className={`relative group overflow-hidden rounded-[2rem] cursor-pointer ${className}`}>
        {/* Image */}
        <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Content */}
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-lg border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center">
                    {service.id}
                </span>
                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight size={20} />
                </div>
            </div>

            <div>
                <h3 className="text-white text-3xl md:text-5xl font-serif mb-2 leading-none">
                    {service.name}
                </h3>
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500">
                    <p className="text-white/80 font-sans text-sm tracking-wide pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {service.desc}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const MobileServiceCard = ({ service }) => (
    <div className="relative group overflow-hidden rounded-[2rem] cursor-pointer flex-shrink-0 w-[85vw] snap-center">
        <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-lg border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center">
                    {service.id}
                </span>
            </div>
            <div>
                <h3 className="text-white text-3xl font-serif mb-2 leading-none">
                    {service.name}
                </h3>
                <p className="text-white/80 font-sans text-sm tracking-wide pt-2 opacity-100">
                    {service.desc}
                </p>
            </div>
        </div>
    </div>
);


const Services = () => {
    const services = {
        hair: { id: "01", name: "Hair Styling", image: hairImage, desc: "Precision cuts, custom coloring & expert styling." },
        nails: { id: "02", name: "Nail Care", image: nailImage, desc: "Luxurious manicures & pedicures." },
        wax: { id: "03", name: "Waxing", image: waxImage, desc: "Gentle full-body waxing." },
        facial: { id: "04", name: "Facial Spa", image: facialImage, desc: "Rejuvenating & radiant treatments." },
        lashes: { id: "05", name: "Lashes", image: lashesImage, desc: "Volume lifts & extensions." },
    };

    return (
        <section id="services" className="h-screen w-full bg-[#FAF9F6] flex justify-center items-center snap-start relative">

            <div className="w-full max-w-[1440px] px-6 md:px-10 h-full flex flex-col py-8">

                <div className="text-center mb-6 md:mb-12 shrink-0">
                    <h2 className="font-serif text-5xl md:text-7xl text-brown-900 mb-4 md:mb-6 tracking-tight">
                        Services We Offer
                    </h2>
                    <div className="w-24 h-px bg-brown-900/20 mx-auto mb-6"></div>
                    <p className="font-sans text-xs md:text-sm text-brown-800 uppercase tracking-[0.3em] font-light">
                        Experience the art of refined beauty
                    </p>
                </div>

                {/* DESKTOP VIEW (Hidden on Mobile) */}
                <div className="hidden md:flex flex-1 min-h-0 flex-col gap-4 pb-4">
                    {/* Row 1: Hair (Large) + Nails */}
                    <div className="flex-[1.2] flex gap-4 min-h-0">
                        <ServiceCard service={services.hair} className="flex-[2]" />
                        <ServiceCard service={services.nails} className="flex-1" />
                    </div>
                    {/* Row 2: Trio */}
                    <div className="flex-1 flex gap-4 min-h-0">
                        <ServiceCard service={services.wax} className="flex-1" />
                        <ServiceCard service={services.facial} className="flex-1" />
                        <ServiceCard service={services.lashes} className="flex-1" />
                    </div>
                </div>

                {/* MOBILE VIEW (Carousel - Hidden on Desktop) */}
                <div className="md:hidden flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    <MobileServiceCard service={services.hair} />
                    <MobileServiceCard service={services.nails} />
                    <MobileServiceCard service={services.wax} />
                    <MobileServiceCard service={services.facial} />
                    <MobileServiceCard service={services.lashes} />
                </div>

            </div>
        </section>
    );
};

export default Services;
