import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Youtube, Instagram, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';

// Update these with your real social URLs
const SOCIAL_LINKS = {
  youtube: 'https://www.youtube.com/@santvaani',
  instagram: 'https://www.instagram.com/santvaani',
  whatsapp: 'https://chat.whatsapp.com/santvaani', // Replace with real invite link
};

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('loading');
    try {
      // Requires a `newsletter_subscribers` table: { email text unique, subscribed_at timestamptz }
      const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email: email.trim().toLowerCase(), subscribed_at: new Date().toISOString() }, { onConflict: 'email' });
      if (error) throw error;
      setSubStatus('success');
      setEmail('');
    } catch {
      setSubStatus('error');
    }
  };

  const exploreLinks = [
    { to: '/saints', label: language === 'EN' ? 'Saints' : 'संत' },
    { to: '/living-saints', label: language === 'EN' ? 'Contemporary Saints' : 'समकालीन संत' },
    { to: '/divine', label: language === 'EN' ? 'Divine Forms' : 'दिव्य रूप' },
    { to: '/bhajans', label: language === 'EN' ? 'Bhajans' : 'भजन' },
    { to: '/quotes', label: language === 'EN' ? 'Quotes' : 'उद्धरण' },
    { to: '/horoscope', label: language === 'EN' ? 'Horoscope' : 'राशिफल' },
  ];

  const communityLinks = [
    { to: '/blog', label: language === 'EN' ? 'Blog' : 'ब्लॉग' },
    { to: '/santvaani-space', label: language === 'EN' ? 'Santvaani Space' : 'संतवाणी स्पेस' },
    { to: '/prabhu-ki-leelaayen', label: language === 'EN' ? 'Divine Stories' : 'दिव्य कथाएं' },
    { to: '/naam-jap', label: language === 'EN' ? 'Naam Jap' : 'नाम जप' },
    { to: '/events', label: language === 'EN' ? 'Events' : 'कार्यक्रम' },
    { to: '/donation', label: language === 'EN' ? 'Donate' : 'दान करें' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-orange-950 text-gray-300">
      {/* Newsletter bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg">
                {language === 'EN' ? 'Get daily spiritual updates' : 'दैनिक आध्यात्मिक अपडेट पाएं'}
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                {language === 'EN'
                  ? 'Quotes, events & bhajans delivered to your inbox.'
                  : 'उद्धरण, कार्यक्रम और भजन आपके इनबॉक्स में।'}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubStatus('idle'); }}
                placeholder={language === 'EN' ? 'Enter your email' : 'ईमेल दर्ज करें'}
                required
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-colors"
              />
              <button
                type="submit"
                disabled={subStatus === 'loading' || subStatus === 'success'}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                {subStatus === 'loading'
                  ? '...'
                  : subStatus === 'success'
                  ? (language === 'EN' ? 'Subscribed!' : 'सदस्य बने!')
                  : (language === 'EN' ? 'Subscribe' : 'सदस्य बनें')}
              </button>
            </form>
            {subStatus === 'error' && (
              <p className="text-red-400 text-xs md:absolute md:bottom-2">
                {language === 'EN' ? 'Something went wrong. Try again.' : 'कुछ गलत हुआ। पुनः प्रयास करें।'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base">ॐ</span>
              </div>
              <span className="text-xl font-bold text-white">
                {language === 'EN' ? 'Santvaani' : 'संतवाणी'}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Community"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
              >
                <WhatsAppIcon />
              </a>
            </div>

            {/* Contact */}
            <div className="space-y-2 pt-1">
              <a href="mailto:santvaani.app@gmail.com" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                santvaani.app@gmail.com
              </a>
              <a href="tel:+918707043565" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 87070 43565
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {language === 'EN' ? 'Explore' : 'अन्वेषण करें'}
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {language === 'EN' ? 'Community' : 'समुदाय'}
            </h3>
            <ul className="space-y-2.5">
              {communityLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
              {language === 'EN' ? 'Company' : 'कंपनी'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: language === 'EN' ? 'About Us' : 'हमारे बारे में' },
                { to: '/donation', label: language === 'EN' ? 'Support Us' : 'हमें सहयोग दें' },
                { to: '/privacy-policy', label: language === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति' },
                { to: '/terms-of-service', label: language === 'EN' ? 'Terms of Service' : 'सेवा की शर्तें' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            © {new Date().getFullYear()} Santvaani.
            <span className="flex items-center gap-1">
              {t('footer.made.with')}
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              {t('footer.made.for')}
            </span>
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy-policy" className="hover:text-orange-400 transition-colors">
              {language === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </Link>
            <span>·</span>
            <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors">
              {language === 'EN' ? 'Terms of Service' : 'सेवा की शर्तें'}
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-orange-400 transition-colors">
              {language === 'EN' ? 'About' : 'हमारे बारे में'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
