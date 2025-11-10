require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./backend/models/users');

const createInitialAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists in the system');
      return process.exit(0);
    }

  // Create initial admin with admin role
const adminUser = await User.create({
  name: 'System Administrator',
  email: 'admin@egyptholiday.com',
  password: 'admin123',
  role: 'admin'  // This sets the role to admin
});

    console.log('✅ Initial admin user created successfully');
    console.log('📧 Email: admin@egyptholiday.com');
    console.log('🔑 Password: admin123');
    console.log('🎯 Role: Administrator');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating initial admin:', error);
    process.exit(1);
  }
};

createInitialAdmin();