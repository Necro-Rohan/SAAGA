import { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';

/* 
  Ambience Card
  - Clickable to open Modal
*/
const AmbienceCard = ({ image, className, onClick }) => (
    <div
        onClick={() => onClick(image)}
        className={`relative group overflow-hidden rounded-[2rem] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 w-full h-full ${className}`}
    >

        {/* Image */}
        <img
            src={image}
            alt="Salon Ambience"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100 grayscale-[10%] group-hover:grayscale-0"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500"></div>

        {/* Glass Border */}
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>

        {/* Hover Reveal Content */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <span className="text-white font-light tracking-widest text-sm uppercase">View</span>
            </div>
        </div>

    </div>
);

const MobileAmbienceCard = ({ image, onClick }) => (
    <div
        onClick={() => onClick(image)}
        className="relative group overflow-hidden rounded-[2rem] cursor-pointer flex-shrink-0 w-[85vw] snap-center h-[450px] shadow-xl"
    >
        <img
            src={image}
            alt="Ambience"
            className="w-full h-full object-cover grayscale-[10%]"
        />
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none"></div>
    </div>
);

const Ambience = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    // 6 Images for the new grid
    const images = [
        "/saaga1.webp",
        "/Saaga 2.webp",
        "/saaga 3.webp",
        "/saaga4.webp",
        "/saaga5.webp",
        "/saaga 6.webp"
    ];

    return (
        <section id="ambience" className="relative w-full bg-[#FAF9F6] h-screen flex flex-col justify-center snap-start overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">

                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-xs font-semibold tracking-[0.3em] text-brown-400 uppercase mb-4 block">
                        A Sanctuary of Calm
                    </span>
                    <h2 className="font-serif text-4xl md:text-6xl text-brown-900 mb-6 tracking-tight">
                        Our Ambience
                    </h2>
                    <div className="w-16 h-px bg-brown-900/30 mx-auto"></div>
                </div>

                {/* DESKTOP VIEW */}
                <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-4 h-[532px]">
                    {images.map((img, index) => (
                        <AmbienceCard key={index} image={img} onClick={setSelectedImage} />
                    ))}
                </div>

                {/* MOBILE VIEW */}
                <div className="md:hidden flex gap-4 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                    {images.map((img, index) => (
                        <MobileAmbienceCard key={index} image={img} onClick={setSelectedImage} />
                    ))}
                </div>

            </div>

            {/* LIGHTBOX MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={40} strokeWidth={1} />
                    </button>

                    <img
                        src={selectedImage}
                        alt="Full size ambience"
                        className="max-w-full max-h-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default Ambience;
