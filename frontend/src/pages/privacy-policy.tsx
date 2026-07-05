import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title="Privacy Policy — Santvaani"
        description="Learn how Santvaani collects, uses, and protects your personal information."
        canonical="https://santvaani.com/privacy-policy"
      />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {language === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </h1>
            <p className="text-sm text-gray-500">
              {language === 'EN' ? 'Last updated: July 2025' : 'अंतिम अपडेट: जुलाई 2025'}
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
              <p>When you use Santvaani, we may collect the following information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Account information:</strong> Name, email address, and profile details when you register.</li>
                <li><strong>Usage data:</strong> Pages visited, features used, and time spent on the platform via Google Analytics 4.</li>
                <li><strong>Device information:</strong> Browser type, device type, and operating system for analytics.</li>
                <li><strong>Push notification tokens:</strong> Firebase Cloud Messaging (FCM) tokens to send you spiritual updates and event reminders (only with your consent).</li>
                <li><strong>Email subscriptions:</strong> Your email address if you choose to subscribe to our newsletter.</li>
                <li><strong>User-generated content:</strong> Blog comments, Santvaani Space posts, and feedback you submit.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and personalize your spiritual journey on our platform.</li>
                <li>To send you event reminders, daily spiritual quotes, and platform updates (only if subscribed).</li>
                <li>To improve our content, features, and user experience through analytics.</li>
                <li>To moderate community posts and maintain a respectful environment.</li>
                <li>To respond to your inquiries and support requests.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">3. Third-Party Services</h2>
              <p>We use the following third-party services that have their own privacy policies:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Supabase</strong> — Database and authentication (supabase.com)</li>
                <li><strong>Google Analytics 4</strong> — Website usage analytics</li>
                <li><strong>Firebase</strong> — Push notifications and analytics</li>
                <li><strong>YouTube API</strong> — Bhajan and live stream content</li>
                <li><strong>Brevo (Sendinblue)</strong> — Email communication</li>
                <li><strong>Google Gemini / Groq AI</strong> — AI-powered features (chatbot, horoscopes)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">4. Cookies & Tracking</h2>
              <p>
                We use cookies and similar technologies for authentication, preferences, and analytics. Google Analytics 4 may set cookies to track usage patterns. You can disable cookies in your browser settings, though some features may not function correctly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">5. Data Storage & Security</h2>
              <p>
                Your data is stored securely on Supabase's PostgreSQL database with row-level security policies. We implement industry-standard security measures, but no system is 100% secure. We encourage you to use a strong password and keep your credentials private.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">6. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access, update, or delete your account information via Profile Settings.</li>
                <li>Unsubscribe from emails at any time using the unsubscribe link in any email.</li>
                <li>Request deletion of your data by contacting us at santvaani.app@gmail.com.</li>
                <li>Opt out of push notifications via your device or browser settings.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">7. Children's Privacy</h2>
              <p>
                Santvaani is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, please contact us immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify registered users of significant changes via email. Continued use of Santvaani after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">9. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-1">
                <p className="font-medium text-gray-800">Santvaani</p>
                <p>Email: <a href="mailto:santvaani.app@gmail.com" className="text-orange-600 hover:underline">santvaani.app@gmail.com</a></p>
                <p>Phone: +91 87070 43565</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
