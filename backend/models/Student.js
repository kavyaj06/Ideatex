const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    phone: String,
    linkedin: String,
    portfolio: String,
    cgpa: { type: Number, default: 0 },
    skills: [String],
    resumeText: String,
    resumeScore: { type: Number, default: 0 },
    resumeFeedback: String,
    screeningScores: {
        aptitude: { type: Number, default: 0 },
        coding: { type: Number, default: 0 },
        gd: { type: Number, default: 0 }
    },
    projects: [{
        title: String,
        role: String,
        description: String,
        techStack: [String],
        link: String,
        duration: String
    }],
    suggestedCompanies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
    createdAt: { type: Date, default: Date.now }
});

StudentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('Student', StudentSchema);
