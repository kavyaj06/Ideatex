const mongoose = require('mongoose');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Test student
        const student = await Student.findOne({ email: 'kavya@gmail.com' });
        if (student) {
            console.log('\n✅ Student found:', student.email);
            console.log('Password hash:', student.password.substring(0, 20) + '...');

            const isMatch = await bcrypt.compare('password123', student.password);
            console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');
        } else {
            console.log('❌ Student not found');
        }

        // Test admin
        const admin = await Admin.findOne({ username: 'admin' });
        if (admin) {
            console.log('\n✅ Admin found:', admin.username);
            console.log('Password hash:', admin.password.substring(0, 20) + '...');

            const isMatch = await bcrypt.compare('password123', admin.password);
            console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');
        } else {
            console.log('❌ Admin not found');
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

testLogin();
