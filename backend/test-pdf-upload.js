const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testPdfAnalysis() {
    try {
        const pdfPath = 'c:\\Users\\cmani\\Downloads\\bcom-fresher-resume.pdf';
        
        console.log('📄 Reading PDF file...');
        if (!fs.existsSync(pdfPath)) {
            console.error('❌ PDF file not found at:', pdfPath);
            return;
        }
        
        console.log('✅ PDF file found');
        console.log('📤 Uploading to API for analysis...\n');
        
        // Create form data
        const formData = new FormData();
        formData.append('resume', fs.createReadStream(pdfPath));
        
        // Send to API
        const response = await fetch('http://localhost:3000/api/resume/analyze', {
            method: 'POST',
            body: formData,
            headers: formData.getHeaders()
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('❌ API Error:', result);
            return;
        }
        
        if (result.success && result.data) {
            const analysis = result.data;
            
            console.log('=' .repeat(80));
            console.log('✅ RESUME ANALYSIS RESULTS');
            console.log('='.repeat(80));
            console.log('\n📊 OVERALL SCORE:', analysis.overallScore + '%');
            console.log('='.repeat(80));
            
            console.log('\n💡 FEEDBACK HIGHLIGHTS:');
            console.log('-'.repeat(80));
            if (analysis.feedback && analysis.feedback.length > 0) {
                analysis.feedback.forEach((item, idx) => {
                    const emoji = item.type === 'positive' ? '✅' : item.type === 'warning' ? '⚠️' : '💡';
                    console.log(`\n${emoji} ${idx + 1}. [${item.type.toUpperCase()}] ${item.title}`);
                    console.log(`   ${item.description}`);
                });
            }
            
            console.log('\n\n📊 SKILL GAP ANALYSIS:');
            console.log('-'.repeat(80));
            if (analysis.skillGaps && analysis.skillGaps.length > 0) {
                analysis.skillGaps.forEach((skill, idx) => {
                    const bar = '█'.repeat(Math.floor(skill.match / 5)) + '░'.repeat(20 - Math.floor(skill.match / 5));
                    console.log(`${idx + 1}. ${skill.skill.padEnd(30)} ${bar} ${skill.match}%`);
                });
            }
            
            console.log('\n\n🎯 CRITICAL IMPROVEMENTS:');
            console.log('-'.repeat(80));
            if (analysis.criticalImprovements && analysis.criticalImprovements.length > 0) {
                analysis.criticalImprovements.forEach((imp) => {
                    console.log(`\n${imp.number}. ${imp.title}`);
                    console.log(`   ${imp.description}`);
                    console.log(`   💭 Suggestion: "${imp.suggestedEdit}"`);
                });
            }
            
            console.log('\n' + '='.repeat(80));
            console.log('✅ Analysis Complete!');
            console.log('='.repeat(80));
            
        } else {
            console.error('❌ Analysis failed:', result);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

testPdfAnalysis();
