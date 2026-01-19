import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';

const Home = () => {
    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative h-screen flex flex-col snap-start">
                <Navbar />
                <div className="w-full h-px bg-beige-300 mb-10 md:mb-16"></div>
                <Hero />
            </div>
            <Services />
        </div>
    );
};

export default Home;
