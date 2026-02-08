import { useState, useEffect } from "react";
import { motion,AnimatePresence } from "framer-motion";

import hairImg from "../../assets/hair_service.png";
import blowDryImg from "../../assets/blowout_service.png";
import nailImg from "../../assets/nail_service.png";

const slides = [
  { src: hairImg, text: "Premium Hair Styling" },
  { src: blowDryImg, text: "Luxury Blowouts" },
  { src: nailImg, text: "Exquisite Nail Care" }
];

const Loader = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('images'); // images, transition, logo

  useEffect(() => {
    if (currentIndex < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 800); 
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase('transition');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (phase === 'transition') {
      const timer = setTimeout(() => {
        setPhase('logo');
      }, 600); 
      return () => clearTimeout(timer);
    }
    
    if (phase === 'logo') {
        const timer = setTimeout(() => {
            onComplete();
        }, 2000); 
        return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-100 bg-cream flex items-center justify-center overflow-hidden"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <AnimatePresence mode="wait">
        {phase === 'images' && (
          <motion.div
            key="images-container"
            className="absolute inset-0 flex items-center justify-center p-4"
            exit={{ opacity: 1 }} // Don't fade out container, let image handle it
          >
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0, scale: 1.1, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(2px)' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <img
                      src={slides[currentIndex].src}
                      alt={slides[currentIndex].text}
                      className="absolute w-[85vw] h-[55vh] md:w-auto md:h-[65vh] object-cover md:object-contain max-w-4xl rounded-4xl shadow-2xl z-10"
                      style={{ transformOrigin: "center center" }}
                  />
                  <p className="absolute top-[80vh] md:top-[85vh] text-brown-900 text-xl md:text-2xl font-serif tracking-wide z-10 text-center w-full px-4">
                    {slides[currentIndex].text}
                  </p>
                </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'transition' && (
            <motion.div 
                key="morph-container"
                className="absolute inset-0 flex items-center justify-center p-4"
            >
                {/* The final image shrinking into the 'S' position */}
                <motion.img
                    src={slides[slides.length - 1].src}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                        opacity: 0, 
                        scale: 0.2, 
                    }} 
                    transition={{ duration: 0.6, ease: "anticipate" }}
                    className="absolute w-[85vw] h-[55vh] md:w-auto md:h-[65vh] object-cover md:object-contain max-w-4xl rounded-4xl shadow-2xl"
                />
            </motion.div>
        )}

        {(phase === 'transition' || phase === 'logo') && (
          <motion.div
            key="logo-container"
            className="relative z-10 flex flex-col items-center justify-center mix-blend-multiply"
          >
            <div className="flex items-center">
                {/* The 'S' reveals first or morphs from the image */}
                <motion.span 
                    className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                    initial={{ opacity: 0, scale: 0.5, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    S
                </motion.span>
                
                {/* The rest of the letters fade in smoothly */}
                <motion.span 
                    className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    AAGA
                </motion.span>
                
                {/* Duplicate 'A' for full SAAGAA correction if needed, assumes SAAGAA is the name */}
                <motion.span 
                    className="font-serif text-6xl md:text-9xl text-brown-900 tracking-tighter inline-block"
                    initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                >
                    A
                </motion.span>
            </div>

            <motion.div
              className="overflow-hidden mt-2"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            >
                <p className="text-brown-500 text-sm md:text-xl font-medium tracking-[0.5em] uppercase whitespace-nowrap text-center px-2">
                  Unisex Salon
                </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Loader;
