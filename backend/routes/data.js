const express = require('express');
const router = express.Router();
const {
    addCompany, getCompanies,
    addAnnouncement, getAnnouncements, deleteAnnouncement,
    updateStudentProfile, getStudentProfile
} = require('../controllers/dataController');

router.post('/companies', addCompany);
router.get('/companies', getCompanies);

router.post('/announcements', addAnnouncement);
router.get('/announcements', getAnnouncements);
router.delete('/announcements/:id', deleteAnnouncement);

router.put('/students/:studentId', updateStudentProfile);
router.get('/students/:studentId', getStudentProfile);

module.exports = router;
