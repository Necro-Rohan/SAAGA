import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
