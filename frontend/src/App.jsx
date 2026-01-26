import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ServicesFull from "./pages/Services";
import Schedule from "./pages/Schedule";
import Offers from "./pages/Offers";
import Shop from "./pages/Shop";

function App() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesFull />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/shop" element={<Shop />} />
    </Routes>
  );
}

export default App;
