import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import AddFood from './pages/AddFood';
import Leaderboard from './pages/Leaderboard';
import MoneyFeed from './pages/MoneyFeed';
import HungerCrisis from './pages/HungerCrisis';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { mockDonations, mockMoneyFeed, mockNGOs } from './mockData';
import { matchDonationsToNGOs } from './utils/matching';

// Toast context helper
let toastId = 0;
export let addToast = () => {};

function Toasts({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{t.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  const [donations, setDonations] = useState(mockDonations);
  const [moneyFeed, setMoneyFeed] = useState(mockMoneyFeed);
  const [toasts, setToasts] = useState([]);

  // Wire up the global toast function
  addToast = useCallback((title, msg, icon = '✅') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, title, msg, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Simulate a live donation arriving every 20 seconds
  useEffect(() => {
    const liveNames = ['Oberoi Grand', 'Park Hyatt', 'JW Marriott', 'Four Seasons', 'Leela Palace'];
    const liveTypes = ['Cooked Meals — Chef Surplus', 'Bakery Items & Desserts', 'Lunch Buffet Leftovers', 'Fresh Produce Bundle'];
    let counter = 100;
    const interval = setInterval(() => {
      counter++;
      const newDonation = {
        id: counter,
        hotelName: liveNames[Math.floor(Math.random() * liveNames.length)],
        emoji: '🍛',
        foodType: liveTypes[Math.floor(Math.random() * liveTypes.length)],
        quantity: Math.floor(Math.random() * 150) + 30,
        unit: Math.random() > 0.5 ? 'meals' : 'kg',
        status: Math.random() > 0.7 ? 'urgent' : 'available',
        expiryHours: Math.random() > 0.7 ? 1 : Math.floor(Math.random() * 6) + 2,
        distance: +(Math.random() * 5 + 0.5).toFixed(1),
        lat: 28.55 + Math.random() * 0.15,
        lng: 77.15 + Math.random() * 0.15,
        claimedBy: null,
        createdAt: new Date().toISOString(),
        color: '#22d3a5',
        isLive: true,
      };
      setDonations(prev => [newDonation, ...prev.slice(0, 11)]);
      addToast('🍱 New Donation!', `${newDonation.hotelName} just listed ${newDonation.quantity} ${newDonation.unit}`, '🍱');
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const claimDonation = useCallback((id) => {
    const donation = donations.find(d => d.id === id);
    if (!donation) return;

    // Use smart matching to find best NGO
    const matches = matchDonationsToNGOs([donation], mockNGOs);
    const bestMatch = matches[0];

    setDonations(prev => prev.map(d =>
      d.id === id ? { ...d, status: 'claimed', claimedBy: bestMatch ? bestMatch.ngo.name : 'Helping Hands NGO' } : d
    ));
    addToast('✅ Claimed!', `Assigned to ${bestMatch ? bestMatch.ngo.name : 'NGO'} for pickup.`, '🚚');
  }, [donations]);

  const addDonation = useCallback((donation) => {
    setDonations(prev => [donation, ...prev]);
    addToast('🎉 Donation Added!', `${donation.quantity} ${donation.unit} listed by ${donation.hotelName}`, '🌿');
  }, []);

  const addMoney = useCallback((entry) => {
    setMoneyFeed(prev => [entry, ...prev]);
    addToast('💚 Thank You!', `₹${entry.amount.toLocaleString()} received from ${entry.donor}`, '💳');
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard donations={donations} />} />
          <Route path="/donations" element={<Donations donations={donations} onClaim={claimDonation} />} />
          <Route path="/add-food" element={<ProtectedRoute><AddFood onAdd={addDonation} /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard donations={donations} /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard donations={donations} />} />
          <Route path="/donate-money" element={<MoneyFeed feed={moneyFeed} onAdd={addMoney} />} />
          <Route path="/crisis" element={<HungerCrisis />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Toasts toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
