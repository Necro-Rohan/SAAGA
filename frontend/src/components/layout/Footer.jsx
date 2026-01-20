import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="locate" className="w-full bg-brown-900 border-t border-brown-700 text-white py-16 px-6 md:px-10 snap-start">
            <div className="max-w-[1440px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-semibold tracking-[0.3em] text-beige-300 uppercase mb-4 block">
                        Get In Touch
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl text-white mb-6 tracking-tight">
                        Locate Us
                    </h2>
                    <div className="w-16 h-px bg-white/20 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-stretch">

                    {/* LEFT: Contact Details */}
                    <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 flex flex-col justify-center h-full">
                        <h3 className="font-serif text-3xl mb-8">Ready to transform?</h3>

                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-brown-700 rounded-full flex-shrink-0">
                                    <MapPin size={24} className="text-beige-200" />
                                </div>
                                <div>
                                    <h4 className="text-beige-200 font-semibold uppercase tracking-wider text-sm mb-2">Visit Us</h4>
                                    <p className="text-white/80 leading-relaxed max-w-sm">
                                        Shop no.09 ground floor, JD Gaatha, <br />
                                        Porwal Rd, Lohegaon, Pune, Maharashtra 411047
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-5">
                                <div className="p-3 bg-brown-700 rounded-full flex-shrink-0">
                                    <Phone size={24} className="text-beige-200" />
                                </div>
                                <div>
                                    <h4 className="text-beige-200 font-semibold uppercase tracking-wider text-sm mb-2">Call Us</h4>
                                    <p className="text-white/80 leading-relaxed font-sans">
                                        +91 91121 57691 <br />
                                        +91 99233 11912
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Socials Placeholder */}
                        <div className="mt-12 pt-8 border-t border-white/10 flex gap-6">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Instagram size={20} className="text-white/80" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Facebook size={20} className="text-white/80" />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: Map */}
                    <div className="relative h-[400px] md:h-full min-h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.1064217077096!2d73.909476375194!3d18.61428248249748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c767757e8213%3A0xf211efeec062e6d3!2sSAAGAA%20SALON!5e0!3m2!1sen!2sin!4v1768939792718!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'contrast(0.9) grayscale(0.1)' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full"
                        ></iframe>

                        {/* Map Overlay Gradient (Optional for blending) */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-brown-900/20 to-transparent"></div>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
                    <p>&copy; {new Date().getFullYear()} SAAGAA SALON. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
