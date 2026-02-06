const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Groq } = require('groq-sdk');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Groq setup
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup
const upload = multer({
    dest: uploadsDir,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF allowed'));
    }
});

// AI Analysis Endpoint
router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });

        // Extract PDF text
        const data = await pdfParse(fs.readFileSync(req.file.path));
        const text = data.text.slice(0, 6000);

        // AI prompt
        const prompt = `You are an expert resume analyzer. Analyze this resume and provide a detailed, honest assessment.

RESUME CONTENT:
${text}

Evaluate the resume based on:
- Content quality and relevance
- Formatting and readability
- Achievements and quantifiable results
- Skill coverage for the candidate's field
- Experience level and career progression
- Grammar and professionalism

Scoring Guidelines:
- 90-100: Outstanding resume with strong achievements, perfect formatting, highly relevant experience
- 75-89: Good resume with clear strengths but some areas for improvement
- 60-74: Average resume that needs significant improvement
- Below 60: Weak resume requiring major revisions

Return ONLY valid JSON with no markdown, no explanations, just the JSON object:
{
  "overallScore": <number 0-100 based on guidelines above>,
  "feedback": [
    {"type": "positive", "title": "Strength Title", "description": "Specific positive aspect"},
    {"type": "warning", "title": "Concern Title", "description": "Specific issue to address"},
    {"type": "improvement", "title": "Area to Improve", "description": "Specific suggestion"}
  ],
  "skillGaps": [
    {"skill": "Relevant Skill Name", "match": <number 0-100 indicating proficiency>}
  ],
  "criticalImprovements": [
    {"number": 1, "title": "Priority Improvement", "description": "Why this matters", "suggestedEdit": "Specific text to add or change"}
  ]
}`;

        // Call Groq
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7
        });

        // Parse response
        const aiResponse = completion.choices[0].message.content;
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const analysis = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);

        // Cleanup
        fs.unlinkSync(req.file.path);

        res.json({ success: true, data: analysis });

    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
