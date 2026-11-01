// Frontend utility for smart routing of food donations to NGOs
export function matchDonationsToNGOs(donations, ngos) {
  const urgencyMap = { low: 1, medium: 2, high: 3 };

  // Function to calculate distance between two lat/lng points using Haversine formula
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  const matches = [];

  // For each donation, find the best NGO match
  donations.forEach(donation => {
    let bestMatch = null;
    let bestScore = -1;

    ngos.forEach(ngo => {
      // Calculate expiry priority (earlier expiry = higher priority)
      const now = Date.now();
      const expiryTime = new Date(donation.createdAt).getTime() + (donation.expiryHours * 3600000);
      const timeToExpiry = Math.max(0, expiryTime - now); // in ms
      const expiryPriority = timeToExpiry === 0 ? 1000 : 1 / (timeToExpiry / 3600000); // higher for sooner expiry

      // NGO urgency priority
      const urgencyPriority = urgencyMap[ngo.urgency] || 1;

      // Distance priority (shorter distance = higher priority)
      const distance = calculateDistance(donation.lat, donation.lng, ngo.lat, ngo.lng);
      const distancePriority = distance === 0 ? 1000 : 1 / distance;

      // Total score
      const score = expiryPriority + urgencyPriority + distancePriority;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          donation,
          ngo,
          score,
          distance,
          expiryPriority,
          urgencyPriority,
          distancePriority
        };
      }
    });

    if (bestMatch) {
      matches.push(bestMatch);
    }
  });

  // Sort matches by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}