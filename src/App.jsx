import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';  // We'll create this next
import Dashboard from './pages/Dashboard';  // Placeholder for now

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Add more routes as we build sections, e.g., <Route path="/inventory" element={<Inventory />} /> */}
      </Route>
    </Routes>
  );
};

export default App;