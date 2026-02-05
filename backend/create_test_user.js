const mongoose = require('mongoose');
const Student = require('./models/Student');
require('dotenv').config();

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        let student = await Student.findOne({ email: 'test@test.com' });
        if (!student) {
            student = new Student({
                name: 'Test Student',
                email: 'test@test.com',
                password: 'password123',
                rollNo: 'TEST001',
                skills: ['Java', 'Python'],
                projects: []
            });
            await student.save();
            console.log('Test user created');
        } else {
            console.log('Test user already exists');
            // Ensure skills exist for testing removal
            if (!student.skills || student.skills.length === 0) {
                student.skills = ['Java', 'Python'];
                await student.save();
                console.log('Restored skills for test user');
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createTestUser();
