const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Groq
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY
});

async function testResumeAnalyzer() {
    try {
        console.log('📄 Reading sample resume...\n');
        
        // Read the sample resume text
        const resumeText = fs.readFileSync(path.join(__dirname, '../test-resume-sample.txt'), 'utf-8');
        
        console.log('🤖 Sending to Groq AI for analysis...\n');
        
        // AI prompt
        const prompt = `Analyze this resume. Return ONLY valid JSON with no additional text:
${resumeText}

Return this exact structure:
{
  "overallScore": number from 0-100,
  "feedback": [
    {"type": "positive", "title": "Strong Point Title", "description": "Detailed description"},
    {"type": "warning", "title": "Warning Title", "description": "Detailed description"},
    {"type": "improvement", "title": "Improvement Area", "description": "Detailed description"}
  ],
  "skillGaps": [
    {"skill": "Skill Name", "match": number from 0-100},
    {"skill": "Another Skill", "match": number from 0-100}
  ],
  "criticalImprovements": [
    {"number": 1, "title": "Improvement Title", "description": "What to improve", "suggestedEdit": "Suggested text"}
  ]
}`;

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7
        });

        // Parse response
        const aiResponse = completion.choices[0].message.content;
        console.log('📊 Raw AI Response:\n');
        console.log(aiResponse);
        console.log('\n' + '='.repeat(80) + '\n');

        // Extract JSON
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            
            console.log('✅ PARSED ANALYSIS RESULTS:\n');
            console.log('Overall Score:', analysis.overallScore + '%');
            console.log('\n📝 Feedback:');
            analysis.feedback?.forEach((item, idx) => {
                console.log(`  ${idx + 1}. [${item.type.toUpperCase()}] ${item.title}`);
                console.log(`     ${item.description}`);
            });
            
            console.log('\n📊 Skill Gaps:');
            analysis.skillGaps?.forEach((skill, idx) => {
                console.log(`  ${idx + 1}. ${skill.skill}: ${skill.match}%`);
            });
            
            console.log('\n🎯 Critical Improvements:');
            analysis.criticalImprovements?.forEach((imp, idx) => {
                console.log(`  ${imp.number}. ${imp.title}`);
                console.log(`     ${imp.description}`);
                console.log(`     Suggested: "${imp.suggestedEdit}"\n`);
            });
            
        } else {
            console.log('❌ Could not extract JSON from response');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Run the test
testResumeAnalyzer();
