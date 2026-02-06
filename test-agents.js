// Using native fetch (Node 18+)

const BASE_URL = "http://localhost:3000";

async function testEndpoint(name, url, method, body) {
    console.log(`\nTesting ${name}...`);
    try {
        const options = {
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (body) options.body = JSON.stringify(body);

        const start = Date.now();
        const res = await fetch(url, options);
        const duration = Date.now() - start;

        if (res.ok) {
            const data = await res.json();
            console.log(`✅ [${res.status}] ${name} Passed (${duration}ms)`);
            if (data.questions) console.log(`   - Generated ${data.questions.length} questions.`);
        } else {
            console.log(`❌ [${res.status}] ${name} Failed (${duration}ms)`);
            const text = await res.text();
            console.log("   Error:", text);
        }
    } catch (err) {
        console.log(`❌ ${name} Error:`, err.message);
    }
}

async function runTests() {
    // Test ONLY Interview Generator first
    await testEndpoint(
        "Interview Generator",
        `${BASE_URL}/api/interview/generate`,
        "POST",
        {
            jobRole: "Software Engineer",
            skillGaps: ["System Design", "AWS"]
        }
    );
}

runTests();
