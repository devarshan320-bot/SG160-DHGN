const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: 'Hotel Manager',
    email: 'hotel@example.com',
    password: 'hotel123',
    role: 'hotel'
  },
  {
    name: 'NGO Officer',
    email: 'ngo@example.com',
    password: 'ngo123',
    role: 'user'
  },
  {
    name: 'Individual User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users to avoid duplicates
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });
    console.log('Cleaned up existing demo users.');

    for (let u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      
      const newUser = new User({
        ...u,
        password: hashedPassword
      });
      await newUser.save();
      console.log(`Created user: ${u.email}`);
    }

    console.log('✅ Seeding completed successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
