import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsOfService() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title="Terms of Service — Santvaani"
        description="Read Santvaani's terms of service governing your use of our spiritual platform."
        canonical="https://santvaani.com/terms-of-service"
      />
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {language === 'EN' ? 'Terms of Service' : 'सेवा की शर्तें'}
            </h1>
            <p className="text-sm text-gray-500">
              {language === 'EN' ? 'Last updated: July 2025' : 'अंतिम अपडेट: जुलाई 2025'}
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Santvaani ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">2. Use of the Platform</h2>
              <p>Santvaani is a spiritual content platform. You agree to use it only for lawful purposes and in a manner consistent with its spiritual mission. You must not:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Post content that is offensive, hateful, abusive, or disrespectful to any religion, community, or individual.</li>
                <li>Use the platform to spam, harass, or harm other users.</li>
                <li>Attempt to gain unauthorized access to any part of the platform.</li>
                <li>Copy, reproduce, or redistribute our content without prior written permission.</li>
                <li>Use bots, scrapers, or automated tools to access the platform.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at santvaani.app@gmail.com if you suspect unauthorized use of your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">4. User-Generated Content</h2>
              <p>
                When you post content on Santvaani Space, blog comments, or other community areas, you grant Santvaani a non-exclusive, royalty-free license to display and distribute that content on the platform. You retain ownership of your content.
              </p>
              <p>
                You are solely responsible for any content you post. We reserve the right to remove content that violates these terms or our community guidelines without notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">5. Intellectual Property</h2>
              <p>
                All content on Santvaani — including saint stories, bhajan metadata, spiritual facts, blog posts, and design elements — is the property of Santvaani or its content providers and is protected by applicable intellectual property laws.
              </p>
              <p>
                Ancient spiritual texts and quotes from saints are part of the public domain and shared for spiritual education purposes with appropriate attribution.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">6. Donations</h2>
              <p>
                Santvaani facilitates connections between users and charitable organizations (ashrams, orphanages). We do not process payments directly. All donations are made directly to the respective organizations. Santvaani is not responsible for the actions of third-party organizations listed on the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">7. AI-Generated Content</h2>
              <p>
                Some features (horoscope readings, chatbot responses, spiritual guidance) are powered by AI. This content is provided for spiritual inspiration and general information only. It is not a substitute for professional advice. We make no guarantees about the accuracy or reliability of AI-generated content.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">8. Disclaimer of Warranties</h2>
              <p>
                Santvaani is provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee that the platform will be uninterrupted, error-free, or free of viruses. Use the platform at your own risk.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">9. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Santvaani shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or inability to access it.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of material changes. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">11. Governing Law</h2>
              <p>
                These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">12. Contact</h2>
              <p>For questions about these Terms, contact us at:</p>
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
