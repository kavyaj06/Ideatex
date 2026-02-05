const Student = require('../models/Student');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.studentRegister = async (req, res) => {
    try {
        const { name, email, password, rollNo } = req.body;
        let student = await Student.findOne({ email });
        if (student) return res.status(400).json({ message: 'Student already exists' });

        student = new Student({ name, email, password, rollNo });
        await student.save();

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Student.findOne({ email });
        if (!student) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        console.log('🔐 Admin login attempt:', req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            console.log('❌ Missing username or password');
            return res.status(400).json({ message: 'Username and password required' });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
            console.log('❌ Admin not found:', username);
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        console.log('✅ Admin found:', username);
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log('🔑 Password match:', isMatch);

        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('✅ Login successful');
        res.json({ token, admin });
    } catch (err) {
        console.error('❌ Admin login error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.adminRegister = async (req, res) => {
    try {
        const { username, password } = req.body;
        let admin = await Admin.findOne({ username });
        if (admin) return res.status(400).json({ message: 'Admin already exists' });

        admin = new Admin({ username, password });
        await admin.save();
        res.status(201).json({ message: 'Admin created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
