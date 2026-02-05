const Company = require('../models/Company');
const Announcement = require('../models/Announcement');
const Student = require('../models/Student');

// Companies
exports.addCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ arrivalDate: 1 });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Announcements
exports.addAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Student Profile Updates
exports.updateStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('suggestedCompanies');
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
