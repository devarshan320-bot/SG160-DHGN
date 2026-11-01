/**
 * Seed Script — run once to populate demo data for the hackathon.
 * Usage: cd backend && node seeds/seedData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const MoneyDonation = require('../models/MoneyDonation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodrescue';

const donors = [
  { donorName: 'Ravi Shankar', amount: 500 },
  { donorName: 'Priya Mehta', amount: 200 },
  { donorName: 'Arjun Nair', amount: 1000 },
  { donorName: 'Sunita Reddy', amount: 150 },
  { donorName: 'Kiran Patel', amount: 750 },
  { donorName: 'Anjali Singh', amount: 300 },
  { donorName: 'Ramesh Gupta', amount: 250 },
  { donorName: 'Divya Kumar', amount: 600 },
  { donorName: 'Suresh Iyer', amount: 400 },
  { donorName: 'Meena Joshi', amount: 100 },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await MoneyDonation.deleteMany({});
    console.log('🗑️  Cleared MoneyDonation collection');

    // Insert with staggered timestamps over last 7 days
    for (let i = 0; i < donors.length; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const doc = new MoneyDonation(donors[i]);
      doc.createdAt = new Date(Date.now() - daysAgo * 86400000);
      await doc.save();
      console.log(`✅ Seeded: ${donors[i].donorName} — ₹${donors[i].amount}`);
    }

    console.log('\n🌱 Seed complete! Total:', donors.length, 'donations');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
