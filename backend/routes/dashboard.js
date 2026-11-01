const express = require('express');
const router = express.Router();

// GET /api/dashboard/analytics
router.get('/analytics', (req, res) => {
  // Dummy data - in real app, this would come from database
  const analytics = {
    totalMeals: 15420,
    totalDonations: 342,
    totalMoney: 125000,
    timelineData: [
      { date: '2026-04-26', meals: 1200, donations: 28 },
      { date: '2026-04-27', meals: 1450, donations: 32 },
      { date: '2026-04-28', meals: 1100, donations: 25 },
      { date: '2026-04-29', meals: 1600, donations: 35 },
      { date: '2026-04-30', meals: 1800, donations: 40 },
      { date: '2026-05-01', meals: 1350, donations: 30 },
      { date: '2026-05-02', meals: 1920, donations: 42 }
    ],
    distributionData: [
      { category: 'Cooked Meals', meals: 8500, color: '#22d3a5' },
      { category: 'Raw Ingredients', meals: 3200, color: '#a78bfa' },
      { category: 'Bakery Items', meals: 2100, color: '#f97316' },
      { category: 'Fresh Produce', meals: 1620, color: '#ef4444' }
    ]
  };

  res.json(analytics);
});

module.exports = router;