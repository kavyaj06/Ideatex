const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['Company Update', 'Interview Schedule', 'Test Instruction', 'Result'], default: 'Company Update' },
    postedBy: { type: String, default: 'Admin' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
