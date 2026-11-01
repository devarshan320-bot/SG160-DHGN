// Utility function for smart routing of food donations to NGOs/Centers
function matchDonationsToNGOs(donations, centers) {
  function urgencyScore(level) {
      if (level === "high") return 1.2;
      if (level === "medium") return 1;
      return 0.85;
  }

  const matches = [];

  donations.forEach((donation) => {
      if (donation.status === "approved") return;
      let best = null;
      let bestScore = 0;
      
      centers.forEach((center) => {
          const quantityFit = Math.min(donation.quantity, center.neededQuantity) / Math.max(donation.quantity, center.neededQuantity);
          const expiryWeight = donation.expiryHours <= 6 ? 1.25 : donation.expiryHours <= 24 ? 1.1 : 1;
          const score = (quantityFit * 60 + urgencyScore(center.urgency) * 30 + expiryWeight * 10);
          
          if (score > bestScore) {
              best = center;
              bestScore = score;
          }
      });
      
      if (best) {
          matches.push({
              id: donation.id,
              donationId: donation.id,
              centerId: best.id,
              donor: donation.location,
              centerName: best.centerName,
              foodType: donation.foodType,
              quantity: donation.quantity,
              unit: donation.unit,
              urgency: best.urgency,
              confidence: Math.min(99, Math.round(bestScore)),
              approved: null
          });
      }
  });

  return matches;
}

module.exports = { matchDonationsToNGOs };