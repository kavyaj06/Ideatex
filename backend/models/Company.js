const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    criteria: {
        minCgpa: { type: Number, default: 0 },
        requiredSkills: [String],
        aptitudeRequired: { type: Boolean, default: true }
    },
    location: String,
    package: String,
    arrivalDate: Date,
    status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
