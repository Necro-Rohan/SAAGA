import { useState, useEffect } from "react";
import axios from "axios";
import { Check, Plus } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import BookingModal from "../components/booking/BookingModal";
import waxImage from "../assets/wax_service.png";
import facialImage from "../assets/facial_service.png";

import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

const ServicesFull = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { activeBooking } = useBooking();
  const navigate = useNavigate();

  const [categoryImages, setCategoryImages] = useState({});

  const scrollToCategory = (id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 200;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transform Flat API Data to UI Structure (Strict UI Preservation)
  const transformData = (apiData) => {
    const categories = {};

    apiData.forEach((service) => {
      let catId = service.category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[()]/g, "");
      // Manual overrides to match exact UI IDs if standard normalize fails
      if (service.category === "Nails & Nail Art") catId = "nails";
      if (service.category === "Hair (His)") catId = "hair-his";
      if (service.category === "Hair (Her)") catId = "hair-her";

      if (!categories[catId]) {
        categories[catId] = {
          id: catId,
          category: service.category,
          items: [], // For direct items
          subsections: [], // For grouped items (like subsections in original data)
        };
      }

      if (service.subcategory) {
        let sub = categories[catId].subsections.find(
          (s) => s.title === service.subcategory,
        );
        if (!sub) {
          sub = { title: service.subcategory, items: [] };
          categories[catId].subsections.push(sub);
        }
        sub.items.push(service);
      } else {
        categories[catId].items.push(service);
      }
    });

    return Object.values(categories);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5001/api/public/services"),
          axios.get("http://localhost:5001/api/public/categories")
        ]);

        // Process Categories to create Image Map
        const imageMap = {};
        categoriesRes.data.forEach(cat => {
          let catId = cat.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[()]/g, "");

          // Apply same overrides as services to ensure matching keys
          if (cat.name === "Nails & Nail Art") catId = "nails";
          if (cat.name === "Hair (His)") catId = "hair-his";
          if (cat.name === "Hair (Her)") catId = "hair-her";

          if (cat.image) {
            imageMap[catId] = cat.image;
          }
        });
        setCategoryImages(imageMap);

        const structuredData = transformData(servicesRes.data);

        // Sort based on backend category order
        const sortedCategories = categoriesRes.data;
        structuredData.sort((a, b) => {
          const indexA = sortedCategories.findIndex(c => c.name === a.category);
          const indexB = sortedCategories.findIndex(c => c.name === b.category);
          // If both found, sort by index
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          // Put defined categories first
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });

        setServices(structuredData);
        if (structuredData.length > 0) setActiveCategory(structuredData[0].id);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (const service of services) {
        const element = document.getElementById(service.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveCategory(service.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [services, loading]);

  // Toggle Service Selection
  const toggleService = (item, variant = null, priceOverride = null) => {
    const itemName = variant ? `${item.name} (${variant})` : item.name;

    if (selectedServices.some((s) => s.name === itemName)) {
      setSelectedServices(selectedServices.filter((s) => s.name !== itemName));
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          ...item,
          name: itemName,
          price: priceOverride || item.price,
        },
      ]);
    }
  };

  const isSelected = (item, variant = null) => {
    const itemName = variant ? `${item.name} (${variant})` : item.name;
    return selectedServices.some((s) => s.name === itemName);
  };

  return (
    <div className="min-h-screen bg-cream text-brown-900 font-sans selection:bg-brown-900 selection:text-white pb-0">
      <div className="fixed top-0 left-0 right-0 z-50 bg-cream">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <Navbar
            showLogo={true}
            onOpenBooking={() => {
              if (activeBooking) {
                navigate("/schedule");
              } else {
                setIsBookingOpen(true);
              }
            }}
          />
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedServices={selectedServices}
      />

      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-brown-900/10 p-4 md:p-6 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${selectedServices.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center gap-4">
          <div className="hidden md:block">
            <span className="text-sm font-bold text-brown-900 uppercase tracking-widest block mb-1">
              Your Selection
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 max-w-xl">
              {selectedServices.map((s, i) => (
                <span
                  key={i}
                  className="text-sm text-brown-600 bg-brown-50 px-2 py-1 rounded inline-block whitespace-nowrap"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="md:hidden flex-1">
              <span className="text-sm font-bold text-brown-900 block">
                {selectedServices.length} Services Selected
              </span>
            </div>
            <button
              onClick={() => {
                if (activeBooking) {
                  navigate("/schedule");
                } else {
                  setIsBookingOpen(true);
                }
              }}
              className="bg-brown-900 text-white px-8 py-4 rounded-full text-base font-medium tracking-wide hover:bg-brown-800 transition-colors shadow-lg w-full md:w-auto"
            >
              {activeBooking ? "My Schedule" : "Schedule Visit"}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row gap-12 pt-32 md:pt-36">
        <aside className="hidden md:block w-72 shrink-0">
          <div className="fixed top-32 w-72 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide py-6 pr-4">
            <nav className="flex flex-col gap-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => scrollToCategory(service.id)}
                  className={`text-left px-5 py-3 rounded-lg text-base tracking-wide transition-all duration-300 font-serif border border-transparent flex justify-between items-center group ${activeCategory === service.id
                    ? "bg-brown-900 text-white shadow-md translate-x-2"
                    : "text-brown-600 hover:bg-brown-900/5 hover:text-brown-900"
                    }`}
                >
                  {service.category}
                  {activeCategory === service.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-2"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="md:hidden fixed top-20 left-0 right-0 bg-cream z-40 py-4 px-4 border-b border-brown-900/5 overflow-x-auto scrollbar-hide shadow-sm">
          <div className="flex gap-2">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => scrollToCategory(service.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold tracking-wide border transition-all duration-300 ${activeCategory === service.id
                  ? "bg-brown-900 text-white border-brown-900 shadow-md"
                  : "bg-white border-brown-900/10 text-brown-700"
                  }`}
              >
                {service.category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 mt-16 md:mt-0">
          <div className="flex flex-col gap-10">
            {services.map((service) => (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-40"
              >
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
                      <div
                        key={index}
                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 px-4 rounded-xl transition-all duration-300 ${isSelected(item) ? "bg-brown-900/5" : "hover:bg-brown-900/5"}`}
                      >
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-large font-medium text-brown-900 group-hover:translate-x-1 transition-transform">
                            {item.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="text-xl font-serif text-brown-600">
                            {item.price ? `₹ ${item.price}` : ""}
                          </span>

                          {item.price && item.price.includes("/") ? (
                            <div
                              className={`relative overflow-hidden rounded-full border border-brown-900 group/split w-[110px] h-[34px] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${isSelected(item, "M") || isSelected(item, "F")
                                ? "bg-brown-900 border-brown-900"
                                : "bg-transparent border-brown-900 hover:bg-white"
                                }`}
                            >
                              {/* Default Content: 'Add' */}
                              <div
                                className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] font-bold text-xs uppercase tracking-wider
                                                                    ${isSelected(item, "M") || isSelected(item, "F") ? "-translate-y-full opacity-0" : "group-hover/split:-translate-y-full group-hover/split:opacity-0 text-brown-900"}
                                                                `}
                              >
                                Add <Plus size={14} className="ml-1" />
                              </div>

                              {/* Hover/Selected Content: M | F selection */}
                              <div
                                className={`absolute inset-0 flex items-center justify-between text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                                                                    ${isSelected(item, "M") || isSelected(item, "F") ? "translate-y-0" : "translate-y-full group-hover/split:translate-y-0"}
                                                                `}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleService(
                                      item,
                                      "M",
                                      item.price.split("/")[0].trim(),
                                    );
                                  }}
                                  className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100
                                                                            ${isSelected(
                                    item,
                                    "M",
                                  )
                                      ? "bg-brown-900 text-white hover:bg-brown-800"
                                      : "bg-white text-brown-900"
                                    }`}
                                >
                                  M{" "}
                                  {isSelected(item, "M") && (
                                    <Check size={10} className="ml-0.5" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleService(
                                      item,
                                      "F",
                                      item.price.split("/")[1]?.trim(),
                                    );
                                  }}
                                  className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100
                                                                            ${isSelected(
                                    item,
                                    "F",
                                  )
                                      ? "bg-brown-900 text-white hover:bg-brown-800"
                                      : "bg-white text-brown-900"
                                    }`}
                                >
                                  F{" "}
                                  {isSelected(item, "F") && (
                                    <Check size={10} className="ml-0.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleService(item)}
                              className={`px-6 py-2 border text-xs tracking-wider uppercase font-bold rounded-full transition-all duration-300 flex items-center gap-2
                                                                ${isSelected(
                                item,
                              )
                                  ? "bg-brown-900 text-white border-brown-900"
                                  : "bg-transparent border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-white"
                                }
                                                            `}
                            >
                              {isSelected(item) ? (
                                <>
                                  Added <Check size={14} />
                                </>
                              ) : (
                                <>
                                  Add <Plus size={14} />
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {service.subsections && (
                  <div className="flex flex-col gap-12 mt-12">
                    {service.subsections.map((sub, idx) => (
                      <div key={idx}>
                        <div className="mb-8 pl-4">
                          <h3 className="font-serif text-2xl text-brown-900 inline-block relative pb-3 font-semibold">
                            {sub.title}
                            <span
                              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brown-900 via-brown-900/40 to-transparent rounded-full"
                              style={{ width: "130%" }}
                            ></span>
                          </h3>
                        </div>
                        <div className="divide-y divide-brown-900/10">
                          {sub.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 px-4 rounded-xl transition-all duration-300 ${isSelected(item) ? "bg-brown-900/5" : "hover:bg-brown-900/5"}`}
                            >
                              <div className="mb-4 sm:mb-0">
                                <h3 className="text-large font-medium text-brown-900 group-hover:translate-x-1 transition-transform">
                                  {item.name}
                                </h3>
                              </div>
                              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                <span className="text-xl font-serif text-brown-600">
                                  {item.price ? `₹ ${item.price}` : ""}
                                </span>

                                {item.price && item.price.includes("/") ? (
                                  <div
                                    className={`relative overflow-hidden rounded-full border border-brown-900 group/split w-[110px] h-[34px] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${isSelected(item, "M") ||
                                      isSelected(item, "F")
                                      ? "bg-brown-900 border-brown-900"
                                      : "bg-transparent border-brown-900 hover:bg-white"
                                      }`}
                                  >
                                    {/* Default Content: 'Add' */}
                                    <div
                                      className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] font-bold text-xs uppercase tracking-wider
                                                                            ${isSelected(item, "M") || isSelected(item, "F") ? "-translate-y-full opacity-0" : "group-hover/split:-translate-y-full group-hover/split:opacity-0 text-brown-900"}
                                                                        `}
                                    >
                                      Add <Plus size={14} className="ml-1" />
                                    </div>

                                    {/* Hover/Selected Content: M | F selection */}
                                    <div
                                      className={`absolute inset-0 flex items-center justify-between text-xs font-bold transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                                                                            ${isSelected(item, "M") || isSelected(item, "F") ? "translate-y-0" : "translate-y-full group-hover/split:translate-y-0"}
                                                                        `}
                                    >
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleService(
                                            item,
                                            "M",
                                            item.price.split("/")[0].trim(),
                                          );
                                        }}
                                        className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100
                                                                                    ${isSelected(
                                          item,
                                          "M",
                                        )
                                            ? "bg-brown-900 text-white hover:bg-brown-800"
                                            : "bg-white text-brown-900"
                                          }`}
                                      >
                                        M{" "}
                                        {isSelected(item, "M") && (
                                          <Check size={10} className="ml-0.5" />
                                        )}
                                      </button>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleService(
                                            item,
                                            "F",
                                            item.price.split("/")[1]?.trim(),
                                          );
                                        }}
                                        className={`flex-1 h-full flex items-center justify-center transition-colors hover:bg-brown-100
                                                                                    ${isSelected(
                                          item,
                                          "F",
                                        )
                                            ? "bg-brown-900 text-white hover:bg-brown-800"
                                            : "bg-white text-brown-900"
                                          }`}
                                      >
                                        F{" "}
                                        {isSelected(item, "F") && (
                                          <Check size={10} className="ml-0.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => toggleService(item)}
                                    className={`px-6 py-2 border text-xs tracking-wider uppercase font-bold rounded-full transition-all duration-300 flex items-center gap-2
                                                                            ${isSelected(
                                      item,
                                    )
                                        ? "bg-brown-900 text-white border-brown-900"
                                        : "bg-transparent border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-white"
                                      }
                                                                        `}
                                  >
                                    {isSelected(item) ? (
                                      <>
                                        Added <Check size={14} />
                                      </>
                                    ) : (
                                      <>
                                        Add <Plus size={14} />
                                      </>
                                    )}
                                  </button>
                                )}
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
