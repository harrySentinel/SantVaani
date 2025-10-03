import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-orange-50 to-orange-100 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ॐ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {t('site.name')}
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">{t('footer.links.title')}</h3>
            <div className="space-y-2">
              <Link to="/saints" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                {t('footer.links.saints')}
              </Link>
              <Link to="/living-saints" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                {t('footer.links.living')}
              </Link>
              <Link to="/divine" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                {t('footer.links.divine')}
              </Link>
              <Link to="/bhajans" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                {t('footer.links.bhajans')}
              </Link>
              <Link to="/donation" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                {t('footer.links.donation')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">{t('footer.connect.title')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>santvaani.app@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4" />
                <span>+91 87070 43565</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-1">
            <span>{t('footer.made.with')}</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>{t('footer.made.for')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}