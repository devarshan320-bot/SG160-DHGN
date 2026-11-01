const express = require('express');
const { matchDonationsToNGOs } = require('../utils/matching');

const router = express.Router();

// POST /api/matching/match
// Body: { donations: [...], ngos: [...] }
router.post('/match', (req, res) => {
  const { donations, ngos } = req.body;

  if (!donations || !ngos) {
    return res.status(400).json({ error: 'Donations and NGOs are required' });
  }

  try {
    const matches = matchDonationsToNGOs(donations, ngos);
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: 'Matching failed' });
  }
});

module.exports = router;