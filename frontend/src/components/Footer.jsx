import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Star, GraduationCap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
                <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
                <img
                  src="/Logo.png"
                  alt="Meghmehul Engineering Classes Logo"
                  className="w-30 h-10 object-contain"
                />
                </Link>
            </div>
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <Star size={16} fill="currentColor" />
              <span className="font-mono font-bold">4.9</span>
              <span className="text-slate-400 text-sm">Google Rating</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              One of the Best Engineering Classes in Vasai. Quality teaching with handwritten notes and personal guidance.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors" data-testid="footer-link-home">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors" data-testid="footer-link-about">About Us</Link></li>
              <li><Link to="/courses" className="hover:text-white transition-colors" data-testid="footer-link-courses">Courses</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors" data-testid="footer-link-reviews">Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors" data-testid="footer-link-contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Courses</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Civil Engineering</li>
              <li>Mechanical Engineering</li>
              <li>EXTC Engineering</li>
              <li>IT Engineering</li>
              <li>Computer Engineering</li>
              <li>Degree & Diploma</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>SHOP NO 7, Laxmi Palace, Vasai Rd W, opposite Vidhyavardhini Degree Engineering College, Gurunanak Nagar, Vasai West, Maharashtra 401202</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+918983692788" className="hover:text-white transition-colors" data-testid="footer-phone">089836 92788</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} />
                <span>Open · Closes 8 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Meghmehul Engineering Classes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};