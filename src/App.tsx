import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ActiveCampaigns from './pages/ActiveCampaigns';

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<ActiveCampaigns />} />
      </Routes>
    </div>
  );
}

export default App;
