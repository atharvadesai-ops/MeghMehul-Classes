import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-12 h-12 bg-blue-600 rounded-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <div className="hidden md:block">
              <div className="text-slate-900 font-bold text-lg leading-tight">Meghmehul</div>
              <div className="text-blue-600 font-mono text-xs tracking-wider uppercase">Engineering Classes</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.name.toLowerCase()}`}
                className={`px-4 py-2 rounded-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <a
            href="tel:+918983692788"
            data-testid="header-call-btn"
            className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white rounded-sm px-6 py-2.5 font-medium transition-all shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            Call Now
          </a>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-900"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-100" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                  className={`px-4 py-2.5 rounded-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="tel:+918983692788"
                data-testid="mobile-call-btn"
                className="mt-2 bg-orange-500 text-white rounded-sm px-4 py-2.5 font-medium text-center"
              >
                Call Now
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};