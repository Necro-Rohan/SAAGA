import { useNavigate } from "react-router-dom";
import ladyImage from "../../assets/lady.png";

const Hero = () => {
    const navigate = useNavigate();

    return (
      <header className="flex flex-col md:flex-row justify-between flex-1 w-full max-w-full overflow-hidden">
        <div className="flex-1 flex flex-col justify-center text-center items-center pt-2 md:pt-0">
          <h1 className="font-serif text-6xl md:text-[5rem] lg:text-[7rem] font-semibold text-brown-700 leading-none tracking-[-2px] mb-2 px-4">
            SAAGAA
          </h1>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-[3.5rem] font-light text-black leading-[1.2] mb-6 md:mb-10 tracking-[1px]">
            unisex salon
          </h2>
          <p
            className="text-base md:text-lg text-brown-900 mb-8 md:mb-16 tracking-[2px]"
            style={{ fontFamily: "'Louis George Cafe', sans-serif" }}
          >
            Transforming Beauty, Transforming You
          </p>
          <button
            onClick={() => navigate("/services")}
            className="bg-beige-200 text-brown-900 px-8 py-3 md:px-10 md:py-4 rounded-full text-base md:text-lg font-medium shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:bg-beige-300 cursor-pointer w-fit z-10"
          >
            Explore Services
          </button>
        </div>

        <div className="flex-1 flex justify-center md:justify-end items-end h-[50vh] md:h-full relative mt-8 md:mt-0 w-full md:pr-12">
          <div className="w-[85%] md:w-auto md:aspect-[5/6] h-full md:h-[min(600px,80vh)] bg-beige-400 rounded-t-[150px] md:rounded-t-[250px] relative overflow-hidden md:overflow-visible">
            <img
              src={ladyImage}
              alt="Relaxed woman beauty portrait"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[130%] max-w-none h-auto object-cover z-10"
            />
          </div>
        </div>
      </header>
    );
};

export default Hero;
