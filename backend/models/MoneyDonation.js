const mongoose = require('mongoose');

const allocationBreakdownSchema = new mongoose.Schema({
    ngoName: String,
    meals: Number
}, { _id: false });

const moneyDonationSchema = new mongoose.Schema({
    donorName: { type: String, required: true },
    amount:    { type: Number, required: true },
    mealsFunded: { type: Number },
    allocationBreakdown: [allocationBreakdownSchema],
    status: { type: String, default: 'Delivered' },
    impactMessage: String,
}, { timestamps: true });

// ── Standalone helper (NOT a method, so it works inside hooks) ────────────────
function buildBreakdown(totalMeals) {
    if (totalMeals <= 0) return [];
    const ngos = ['Hope Shelter', 'Care Shelter', 'Community Aid', 'Green Valley NGO', 'Helping Hands'];
    const numNgos = Math.floor(Math.random() * 2) + 1;
    const selected = ngos.sort(() => 0.5 - Math.random()).slice(0, numNgos);

    if (numNgos === 1 || totalMeals === 1) {
        return [{ ngoName: selected[0], meals: totalMeals }];
    }

    const meals1 = Math.floor(totalMeals * (0.4 + Math.random() * 0.4));
    const meals2 = totalMeals - meals1;
    return [
        { ngoName: selected[0], meals: meals1 },
        { ngoName: selected[1], meals: meals2 }
    ].filter(b => b.meals > 0);
}

// ── Pre-save hook (was pre-validate, now uses standalone helper) ──────────────
moneyDonationSchema.pre('save', function(next) {
    if (this.isNew) {
        if (!this.mealsFunded) {
            this.mealsFunded = Math.floor(this.amount / 20); // ₹20 per meal
        }
        if (!this.allocationBreakdown || this.allocationBreakdown.length === 0) {
            this.allocationBreakdown = buildBreakdown(this.mealsFunded);
        }
        const ngos = this.allocationBreakdown.map(b => b.ngoName).join(' & ');
        this.impactMessage = `₹${this.amount} funded ${this.mealsFunded} meals delivered to ${ngos || 'NGOs'}`;
    }
    next();
});

module.exports = mongoose.model('MoneyDonation', moneyDonationSchema);
