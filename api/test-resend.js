/**
 * RESEND API TEST SCRIPT - ZYBORN
 * 
 * Instructions:
 * 1. Save this file to your Downloads folder
 * 2. Open Command Prompt
 * 3. Type: cd C:\Users\pfzol\Downloads
 * 4. Type: node test-resend.js
 */

const RESEND_API_KEY = 're_4VpfuJnJ_DtkBzjvEmTWJEJcXZsHDomKE';
const TEST_EMAIL = 'hello@zyborn.com';

async function testResendAPI() {
  console.log('Testing Resend API...\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ZYBORN ART <hello@zyborn.com>',
        to: TEST_EMAIL,
        subject: 'ZYBORN Email System Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
            <h1 style="color: #F6931B;">Test Successful!</h1>
            <p>Your Resend email integration is working correctly.</p>
            <p style="color: #888; font-size: 12px;">Sent at: ${new Date().toISOString()}</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('SUCCESS! Email sent.');
      console.log('Email ID:', data.id);
      console.log('\nCheck your inbox at:', TEST_EMAIL);
    } else {
      console.log('FAILED:', response.status);
      console.log('Error details:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('Network error:', error.message);
  }
}

testResendAPI();
