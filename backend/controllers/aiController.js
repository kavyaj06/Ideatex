const Student = require('../models/Student');
const Company = require('../models/Company');

// Mock AI Resume Scoring
exports.scoreResume = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Logic: Score based on number of skills and presence of keywords
        const skillsCount = student.skills.length;
        let score = 50 + (skillsCount * 5); // Base 50 + 5 per skill
        if (score > 100) score = 100;

        let feedback = "Nice resume. Try adding more projects related to your core skills.";
        if (score > 80) feedback = "Excellent resume! Strong skill set confirmed.";
        else if (score < 60) feedback = "Consider adding more industry-relevant skills and certifications.";

        student.resumeScore = score;
        student.resumeFeedback = feedback;
        await student.save();

        res.json({ score, feedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// AI Based Company Suggestions for a Student
exports.getCompanySuggestions = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        const companies = await Company.find();

        const suggestions = companies.filter(company => {
            // Check CGPA criteria
            if (student.cgpa < company.criteria.minCgpa) return false;

            // Check skills match (at least one skill match)
            const matchedSkills = student.skills.filter(skill =>
                company.criteria.requiredSkills.includes(skill)
            );
            return matchedSkills.length > 0;
        });

        student.suggestedCompanies = suggestions.map(c => c._id);
        await student.save();

        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// AI Ranking of Students for a specific Company (Admin Feature)
exports.getRankedStudents = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        const students = await Student.find();

        const ranked = students.map(student => {
            let score = 0;
            // CGPA weight (40%)
            score += (student.cgpa / 10) * 40;
            // Skills match (30%)
            const matchedSkills = student.skills.filter(skill =>
                company.criteria.requiredSkills.includes(skill)
            );
            score += (matchedSkills.length / company.criteria.requiredSkills.length) * 30;
            // Screening scores (30%)
            const avgScreening = (student.screeningScores.aptitude + student.screeningScores.coding + student.screeningScores.gd) / 3;
            score += (avgScreening / 100) * 30;

            return {
                student,
                matchScore: Math.round(score),
                reasons: [
                    student.cgpa >= company.criteria.minCgpa ? "CGPA matches criteria" : "CGPA below criteria",
                    matchedSkills.length > 0 ? `Matches ${matchedSkills.length} required skills` : "No core skill match",
                    avgScreening > 70 ? "High screening performance" : "Average screening performance"
                ]
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        res.json(ranked);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
