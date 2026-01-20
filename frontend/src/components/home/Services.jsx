import waxImage from '../../assets/wax_service.png';
import facialImage from '../../assets/facial_service.png';
import { ArrowUpRight } from 'lucide-react';

/* 
  Expanding Flex Card
*/
const ServiceCard = ({ service, className }) => (
    <div className={`relative flex-1 hover:flex-[2] transition-[flex-grow] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl mx-2 first:ml-0 last:mr-0 min-w-0 ${className}`}>

        {/* Image */}
        <img
            src={service.image}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100 grayscale-[10%] group-hover:grayscale-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Glass Border */}
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>

        {/* Content Container */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between overflow-hidden">

            {/* Top Row */}
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-xs md:text-sm border border-white/20 bg-white/10 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                    {service.id}
                </span>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 bg-white/10 backdrop-blur-md p-2 rounded-full text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            {/* Bottom Text Area */}
            <div className="relative z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-serif font-light leading-none tracking-tight whitespace-nowrap mb-2">
                    {service.name}
                </h3>

                {/* Description */}
                <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden">
                    <p className="text-white/80 font-sans text-xs tracking-wide font-light pt-3 border-t border-white/20 mt-2 leading-relaxed max-w-[95%]">
                        {service.desc}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const MobileServiceCard = ({ service }) => (
    <div className="relative group overflow-hidden rounded-[2rem] cursor-pointer flex-shrink-0 w-[85vw] snap-center h-[450px] shadow-xl">
        <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover grayscale-[10%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>

        <div className="absolute inset-0 p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className="font-serif text-white/90 text-sm border border-white/20 bg-white/5 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center tracking-widest">
                    {service.id}
                </span>
            </div>
            <div>
                <h3 className="text-white text-4xl font-serif font-light leading-none mb-3">
                    {service.name}
                </h3>
                <p className="text-white/80 font-sans text-sm tracking-wide font-light border-t border-white/20 pt-3 opacity-90">
                    {service.desc}
                </p>
            </div>
        </div>
    </div>
);

const Services = () => {
    const services = {
        facial: { id: "01", name: "Facial Spa", image: facialImage, desc: "Rejuvenating treatments designed to restore your natural glow." },
        hair: { id: "02", name: "Hair Styling", image: "/Hairs.jpg", desc: "Precision cuts & expert coloring tailored to you." },
        nails: { id: "03", name: "Nail Care", image: "/Nails.jpg", desc: "Luxurious manicures & pedicures using premium products." },
        wax: { id: "04", name: "Waxing", image: waxImage, desc: "Gentle full-body waxing for smooth, radiant skin." },
        lashes: { id: "05", name: "Lashes", image: "/Eyelashes.png", desc: "Volume lifts & extensions for captivating eyes." },
    };

    return (
        <section id="services" className="relative w-full bg-[#FAF9F6] h-screen flex flex-col justify-center snap-start overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">

                {/* Header - EXACT SAME as Feedback */}
                <div className="text-center mb-20">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-400 uppercase mb-4 block">
                        Experience the art of refined beauty
                    </span>
                    <h2 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight">
                        Services We Offer
                    </h2>
                    <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
                </div>

                {/* DESKTOP VIEW - FIXED BLOCK matched to Feedback Height (~532px) */}
                {/* 290 + 226 + 16(gap) = 532px */}
                <div className="hidden md:flex flex-col gap-4 h-[532px]">

                    {/* TOP ROW */}
                    <div className="flex w-full gap-0 h-[290px]">
                        <ServiceCard service={services.facial} className="h-full" />
                        <ServiceCard service={services.hair} className="h-full" />
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="flex w-full gap-0 h-[226px]">
                        <ServiceCard service={services.nails} className="h-full" />
                        <ServiceCard service={services.wax} className="h-full" />
                        <ServiceCard service={services.lashes} className="h-full" />
                    </div>

                </div>

                {/* MOBILE VIEW */}
                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    <MobileServiceCard service={services.facial} />
                    <MobileServiceCard service={services.hair} />
                    <MobileServiceCard service={services.nails} />
                    <MobileServiceCard service={services.wax} />
                    <MobileServiceCard service={services.lashes} />
                </div>

            </div>
        </section>
    );
};

export default Services;
