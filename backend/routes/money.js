const express = require('express');
const router = express.Router();
const MoneyDonation = require('../models/MoneyDonation');

router.get('/analytics', async (req, res) => {
    try {
        const donations = await MoneyDonation.find().sort({ createdAt: -1 });
        const totalMoney = donations.reduce((sum, d) => sum + d.amount, 0);
        const totalMeals = donations.reduce((sum, d) => sum + d.mealsFunded, 0);
        
        const allocationMap = {};
        donations.forEach(donation => {
            if (donation.allocationBreakdown && donation.allocationBreakdown.length > 0) {
                donation.allocationBreakdown.forEach(allocation => {
                    if (!allocationMap[allocation.ngoName]) {
                        allocationMap[allocation.ngoName] = 0;
                    }
                    allocationMap[allocation.ngoName] += allocation.meals;
                });
            } else if (donation.allocatedTo) {
                // For older records
                if (!allocationMap[donation.allocatedTo]) {
                    allocationMap[donation.allocatedTo] = 0;
                }
                allocationMap[donation.allocatedTo] += donation.mealsFunded;
            }
        });

        const allocationSummary = Object.keys(allocationMap).map(ngoName => ({
            ngoName,
            meals: allocationMap[ngoName]
        })).sort((a, b) => b.meals - a.meals);

        res.json({
            totalMoney,
            totalMeals,
            allocationSummary
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
