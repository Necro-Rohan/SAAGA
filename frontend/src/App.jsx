import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ServicesFull from './pages/Services';
import Schedule from './pages/Schedule';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesFull />} />
      <Route path="/schedule" element={<Schedule />} />
    </Routes>
  )
}

export default App
