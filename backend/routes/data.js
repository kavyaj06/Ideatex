const express = require('express');
const router = express.Router();
const {
    addCompany, getCompanies,
    addAnnouncement, getAnnouncements,
    updateStudentProfile, getStudentProfile
} = require('../controllers/dataController');

router.post('/companies', addCompany);
router.get('/companies', getCompanies);

router.post('/announcements', addAnnouncement);
router.get('/announcements', getAnnouncements);

router.put('/students/:studentId', updateStudentProfile);
router.get('/students/:studentId', getStudentProfile);

module.exports = router;
