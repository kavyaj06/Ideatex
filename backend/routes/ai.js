const express = require('express');
const router = express.Router();
const { scoreResume, getCompanySuggestions, getRankedStudents } = require('../controllers/aiController');

router.get('/resume-score/:studentId', scoreResume);
router.get('/suggestions/:studentId', getCompanySuggestions);
router.get('/rank-students/:companyId', getRankedStudents);

module.exports = router;
