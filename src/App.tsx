import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ActiveCampaigns from './pages/ActiveCampaigns';
import CenterWiseData from './pages/CenterWiseData';
import Mapping from './pages/Mapping';
import Chat from './pages/Chat';

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<ActiveCampaigns />} />
        <Route path="/center-wise" element={<CenterWiseData />} />
        <Route path="/mapping" element={<Mapping />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
