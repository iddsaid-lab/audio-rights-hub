
import React from 'react';
import { Link } from 'react-router-dom';
import { MusicIcon, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-brand-purple">
              <MusicIcon className="h-6 w-6" />
              <span className="text-xl font-bold">AudioRightsHub</span>
            </Link>
            <p className="text-gray-600 text-sm">
              COSOTA's official platform for music copyright registration, management, and protection in Tanzania.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-brand-purple text-sm">Home</Link></li>
              <li><Link to="/browse" className="text-gray-600 hover:text-brand-purple text-sm">Browse Audio</Link></li>
              <li><Link to="/register" className="text-gray-600 hover:text-brand-purple text-sm">Artist Registration</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-brand-purple text-sm">About COSOTA</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-600 hover:text-brand-purple text-sm">Help Center</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-purple text-sm">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-purple text-sm">Privacy Policy</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-purple text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <span>+255 22 123 4567</span>
              </li>
              <li className="flex items-center text-gray-600 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@cosota.go.tz</span>
              </li>
              <li className="mt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-brand-purple">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-brand-purple">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-brand-purple">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-6 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Copyright Society of Tanzania (COSOTA). All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
