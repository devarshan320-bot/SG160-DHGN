// =====================
// MOCK DATA STORE
// =====================

export const mockDonations = [
  { id: 1, hotelName: 'The Grand Hyatt', emoji: '🏨', foodType: 'Cooked Meals — Biryani & Curry', quantity: 120, unit: 'meals', status: 'available', expiryHours: 3, distance: 1.2, lat: 12.97, lng: 77.59, claimedBy: null, createdAt: new Date(Date.now() - 20 * 60000).toISOString(), color: '#22d3a5' },
  { id: 2, hotelName: 'Marriott Hotel', emoji: '🌟', foodType: 'Raw Ingredients — Vegetables & Grains', quantity: 85, unit: 'kg', status: 'available', expiryHours: 8, distance: 2.8, lat: 12.98, lng: 77.61, claimedBy: null, createdAt: new Date(Date.now() - 45 * 60000).toISOString(), color: '#a78bfa' },
  { id: 3, hotelName: 'Taj Palace', emoji: '🏰', foodType: 'Packaged Bread & Pastries', quantity: 200, unit: 'pieces', status: 'urgent', expiryHours: 1, distance: 0.9, lat: 12.96, lng: 77.57, claimedBy: null, createdAt: new Date(Date.now() - 60 * 60000).toISOString(), color: '#ef4444' },
  { id: 4, hotelName: 'ITC Maurya', emoji: '🍽️', foodType: 'Cooked Meals — Dal & Rice', quantity: 60, unit: 'meals', status: 'claimed', expiryHours: 4, distance: 3.5, lat: 12.99, lng: 77.63, claimedBy: 'Helping Hands NGO', createdAt: new Date(Date.now() - 90 * 60000).toISOString(), color: '#22d3a5' },
  { id: 5, hotelName: 'Radisson Blu', emoji: '🥘', foodType: 'Catering Surplus — Mixed', quantity: 300, unit: 'meals', status: 'available', expiryHours: 5, distance: 4.1, lat: 12.95, lng: 77.60, claimedBy: null, createdAt: new Date(Date.now() - 15 * 60000).toISOString(), color: '#f97316' },
  { id: 6, hotelName: 'Le Méridien', emoji: '🥗', foodType: 'Fresh Salads & Fruits', quantity: 45, unit: 'kg', status: 'urgent', expiryHours: 1, distance: 1.7, lat: 12.97, lng: 77.62, claimedBy: null, createdAt: new Date(Date.now() - 5 * 60000).toISOString(), color: '#ef4444' },
];

export const mockLeaderboard = [
  { id: 1, hotelName: 'The Grand Hyatt', emoji: '🏨', credits: 2840, meals: 1420, badge: '🏆', since: 'Jan 2024' },
  { id: 2, hotelName: 'Taj Palace', emoji: '🏰', credits: 2310, meals: 1155, badge: '🥈', since: 'Feb 2024' },
  { id: 3, hotelName: 'Marriott Hotel', emoji: '🌟', credits: 1980, meals: 990, badge: '🥉', since: 'Jan 2024' },
  { id: 4, hotelName: 'Radisson Blu', emoji: '🥘', credits: 1540, meals: 770, badge: '', since: 'Mar 2024' },
  { id: 5, hotelName: 'ITC Maurya', emoji: '🍽️', credits: 1320, meals: 660, badge: '', since: 'Apr 2024' },
  { id: 6, hotelName: 'Le Méridien', emoji: '🥗', credits: 980, meals: 490, badge: '', since: 'Apr 2024' },
  { id: 7, hotelName: 'Sheraton', emoji: '🏩', credits: 740, meals: 370, badge: '', since: 'Apr 2024' },
  { id: 8, hotelName: 'Hilton Garden', emoji: '🌼', credits: 560, meals: 280, badge: '', since: 'May 2024' },
];

export const mockNGOs = [
  { id: 1, name: 'Helping Hands NGO', active: true, mealsReceived: 4200, region: 'North Bangalore', lat: 12.99, lng: 77.58 },
  { id: 2, name: 'Zero Hunger Trust', active: true, mealsReceived: 3600, region: 'South Bangalore', lat: 12.93, lng: 77.61 },
  { id: 3, name: 'Food For All', active: false, mealsReceived: 2900, region: 'East Bangalore', lat: 12.96, lng: 77.65 },
  { id: 4, name: 'Annadaan Society', active: true, mealsReceived: 5100, region: 'West Bangalore', lat: 12.97, lng: 77.55 },
];

export const mockMoneyFeed = [
  { id: 1, donor: 'Rahul Mehta', avatar: 'R', amount: 5000, allocated: 'Vehicle Logistics', status: 'Allocated', time: '2 min ago', txId: 'TXN-0041' },
  { id: 2, donor: 'Priya Sharma', avatar: 'P', amount: 2500, allocated: 'Cold Storage', status: 'Spent', time: '14 min ago', txId: 'TXN-0040' },
  { id: 3, donor: 'Anon Donor', avatar: 'A', amount: 10000, allocated: 'Logistics Fund', status: 'Allocated', time: '32 min ago', txId: 'TXN-0039' },
  { id: 4, donor: 'TechCorp CSR', avatar: 'T', amount: 25000, allocated: 'NGO Support Grant', status: 'Spent', time: '1 hr ago', txId: 'TXN-0038' },
  { id: 5, donor: 'Nisha Patel', avatar: 'N', amount: 1500, allocated: 'Packaging Material', status: 'Received', time: '2 hr ago', txId: 'TXN-0037' },
  { id: 6, donor: 'Arjun Gupta', avatar: 'A', amount: 3000, allocated: 'Driver Wages', status: 'Spent', time: '3 hr ago', txId: 'TXN-0036' },
];

export const mockWeekData = [
  { day: 'Mon', meals: 480, donors: 12 },
  { day: 'Tue', meals: 620, donors: 18 },
  { day: 'Wed', meals: 390, donors: 9 },
  { day: 'Thu', meals: 810, donors: 24 },
  { day: 'Fri', meals: 1100, donors: 31 },
  { day: 'Sat', meals: 940, donors: 27 },
  { day: 'Sun', meals: 1280, donors: 36 },
];

export const stats = {
  totalMeals: 12480,
  mealsThisWeek: 5620,
  activeDonations: 4,
  totalDonors: 187,
  moneyRaised: 248000,
  ngosServed: 24,
  wasteReduced: 8.4,
};
