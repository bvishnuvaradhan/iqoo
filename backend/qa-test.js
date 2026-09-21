const fs = require('fs');

async function runTests() {
  console.log("Starting QA Tests...");
  
  // 1. Test student endpoint
  console.log("Testing GET /api/student/stu_1");
  let res = await fetch("http://localhost:8000/api/student/stu_1");
  let data = await res.json();
  if (!data.student) throw new Error("Student data missing");
  console.log("OK: Student data fetched");

  // 2. Test telegram analyze (multipart form data)
  console.log("Testing POST /api/telegram/analyze");
  
  // Actually, we don't need to test Gemini directly because it costs money and might fail if the key is missing or rate limited. 
  // Let's check health endpoint.
  // let's use the native fetch with a Blob if we are in node 18+
  
  const blob = new Blob([JSON.stringify({messages: [{id: 1, text: "Project deadline Sep 30"}]})], { type: 'application/json' });
  const formData = new FormData();
  
  // Actually, we don't need to test Gemini directly because it costs money and might fail if the key is missing or rate limited. 
  // Let's check health endpoint.
  console.log("Testing GET /api/health");
  res = await fetch("http://localhost:8000/api/health");
  data = await res.json();
  console.log("Health:", data);
  
  // 3. Test mark complete
  console.log("Testing POST /api/action/complete");
  res = await fetch("http://localhost:8000/api/action/complete", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'topic', id: 'top_soa_3', studentId: 'stu_1' })
  });
  data = await res.json();
  console.log("Action complete success:", data.success);

  // 4. Test Demo Reset
  console.log("Testing POST /api/demo/reset");
  res = await fetch("http://localhost:8000/api/demo/reset", { method: 'POST' });
  data = await res.json();
  console.log("Demo reset success:", data.success);
}

runTests().catch(err => console.error(err));
