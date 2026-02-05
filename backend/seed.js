const mongoose = require('mongoose');
const Student = require('./models/Student');
const Admin = require('./models/Admin');
const Company = require('./models/Company');
const Announcement = require('./models/Announcement');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Student.deleteMany({});
        await Admin.deleteMany({});
        await Company.deleteMany({});
        await Announcement.deleteMany({});

        // Create Admin
        const admin = new Admin({ username: 'admin', password: 'password123' });
        await admin.save();
        console.log('Admin seeded');

        // Create Students
        const students = await Student.create([
            {
                name: 'Kavya Ganesh', email: 'kavya@gmail.com', password: 'password123', rollNo: '2024CS101',
                cgpa: 9.2, skills: ['React', 'Node.js', 'Python'],
                screeningScores: { aptitude: 85, coding: 90, gd: 80 }
            },
            {
                name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'password123', rollNo: '2024CS102',
                cgpa: 8.5, skills: ['Java', 'SQL', 'C++'],
                screeningScores: { aptitude: 75, coding: 70, gd: 85 }
            }
        ]);
        console.log('Students seeded');

        // Create Companies
        const companies = await Company.create([
            {
                name: 'Google', description: 'Search and Cloud computing company.',
                criteria: { minCgpa: 8.5, requiredSkills: ['Python', 'Node.js', 'React'], aptitudeRequired: true },
                location: 'Bangalore', package: '30 LPA', arrivalDate: new Date('2024-03-15')
            },
            {
                name: 'Microsoft', description: 'Tech giant working on OS and Cloud.',
                criteria: { minCgpa: 8.0, requiredSkills: ['Java', 'C++', 'SQL'], aptitudeRequired: true },
                location: 'Hyderabad', package: '25 LPA', arrivalDate: new Date('2024-03-20')
            }
        ]);
        console.log('Companies seeded');

        // Create Announcements
        await Announcement.create([
            { title: 'Google Recruitment', content: 'Google is coming for recruitment on 15th March. Check criteria.', type: 'Company Update' },
            { title: 'Mock Test Schedule', content: 'Aptitude mock test is scheduled for tomorrow at 10 AM.', type: 'Test Instruction' }
        ]);
        console.log('Announcements seeded');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
