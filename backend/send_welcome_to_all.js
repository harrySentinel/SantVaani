// Send welcome email to all existing users
const { sendBroadcastEmail } = require('./email_service');

const recipients = [
  { email: "satyamrk91@gmail.com", name: "Rajeev" },
  { email: "vainhavgupta20052014@gmail.com", name: "Vaibhav" },
  { email: "alpanasinghsc@gmail.com", name: "Alpana" },
  { email: "kushagrasrivastava183@gmail.com", name: "Kushagra" },
  { email: "siddhanshpandey5@gmail.com", name: "Siddhansh" },
  { email: "adityasrivastav9721057380@gmail.com", name: "Aditya" },
  { email: "na@na.com", name: "Friend" },
  { email: "komaldnb9@gmail.com", name: "Komal" },
  { email: "nyadavniraj786@gmail.com", name: "Niraj" },
  { email: "adityasri.codingal@gmail.com", name: "Aditya" },
  { email: "atulksrivastav1970@gmail.com", name: "Atul" },
  { email: "arpitakumaripatwa@gmail.com", name: "Arpita" },
  { email: "kumariarpita8503@gmail.com", name: "Arpita" },
  { email: "ritaksrivastav1970@gmail.com", name: "Reeta" },
  { email: "kiday41728@usiver.com", name: "Friend" },
  { email: "harryalp6@gmail.com", name: "Friend" },
  { email: "pragatiyadav7890@gmail.com", name: "Pragati" },
  { email: "alpanasinghcs@gmail.com", name: "Alpana" },
  { email: "aditya.srivastava1801@gmail.com", name: "Aditya" },
  { email: "adityasri1801@gmail.com", name: "Aditya" }
];

const subject = "Welcome to Santvaani - Your Spiritual Journey Begins";

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
      <div style="font-size: 72px; color: white; margin-bottom: 20px;">ॐ</div>
      <h1 style="color: white; font-size: 28px; margin: 0;">Welcome to Santvaani</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 10px;">Your Spiritual Journey Begins</p>
    </div>
    <div style="padding: 40px 30px; color: #374151; line-height: 1.8;">
      <p style="font-size: 18px; margin-bottom: 20px;">Namaste!</p>
      <p>We are delighted to welcome you to <strong>Santvaani Digital Ashram</strong> - where ancient wisdom meets modern hearts.</p>
      <p>You have joined a beautiful community of spiritual seekers dedicated to growth, peace, and divine connection.</p>
      <h3 style="color: #f97316; margin-top: 30px;">What Awaits You:</h3>
      <ul style="list-style: none; padding: 0;">
        <li style="padding: 8px 0;"><strong>Devotional Bhajans</strong> - Live streams and sacred songs</li>
        <li style="padding: 8px 0;"><strong>Bhagavad Gita AI Chatbot</strong> - Divine wisdom at your fingertips</li>
        <li style="padding: 8px 0;"><strong>Santvaani Space</strong> - Connect with fellow seekers</li>
        <li style="padding: 8px 0;"><strong>Daily Horoscope</strong> - Personalized spiritual guidance</li>
        <li style="padding: 8px 0;"><strong>Museum of Saints</strong> - Explore divine biographies</li>
        <li style="padding: 8px 0;"><strong>Spiritual Blogs</strong> - Deep wisdom and teachings</li>
      </ul>
      <p style="margin-top: 30px;">Start exploring today and let your spiritual journey unfold.</p>
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://santvaani.com" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Santvaani</a>
      </div>
      <p style="font-style: italic; color: #6b7280; margin-top: 30px;">"The soul is neither born, and nor does it die." - Bhagavad Gita 2.20</p>
      <div style="color: #f97316; font-weight: 600; margin-top: 40px; text-align: center;">
        With Divine Blessings<br/>
        The Santvaani Team
      </div>
    </div>
    <div style="background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280;">
      <p style="margin: 0; font-size: 14px;">You are receiving this email because you joined Santvaani.</p>
      <p style="margin: 10px 0 0 0; font-size: 12px;">© 2025 Santvaani Digital Ashram. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

console.log(`\n📧 Sending welcome email to ${recipients.length} users...\n`);

sendBroadcastEmail(recipients, subject, htmlContent)
  .then(result => {
    if (result.success) {
      console.log(`\n✅ SUCCESS! Welcome emails sent to all ${recipients.length} users!\n`);
      console.log('📬 Users should receive emails shortly.\n');
    } else {
      console.log('\n❌ ERROR sending emails:', result.error);
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR:', error);
  });
