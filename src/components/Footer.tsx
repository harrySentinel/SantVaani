
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
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
                SantVaani
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Spreading the divine wisdom and teachings of great Indian saints across the world. 
              A digital sanctuary for spiritual seekers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/saints" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                Saints
              </Link>
              <Link to="/living-saints" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                Living Saints
              </Link>
              <Link to="/divine" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                Divine Forms
              </Link>
              <Link to="/bhajans" className="block text-gray-600 hover:text-orange-600 transition-colors text-sm">
                Bhajans & Quotes
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Connect</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Mail className="w-4 h-4" />
                <span>contact@santvaani.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for spiritual seekers worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
