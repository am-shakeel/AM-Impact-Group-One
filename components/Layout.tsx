import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Award, Eye, Shield, Sun, Moon, ChevronDown, Cloud, Database, Calendar } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageViews, setPageViews] = useState<number>(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    const currentPage = location.pathname.substring(1) || 'home';
    const key = `pageViews_${currentPage}`;
    const storedViews = localStorage.getItem(key);
    let views = storedViews ? parseInt(storedViews) : 0;
    views++;
    localStorage.setItem(key, views.toString());
    setPageViews(views);
  }, [location.pathname]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-am-600 dark:text-am-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-am-600 dark:hover:text-am-400';
  const isParentActive = (paths: string[]) => paths.some(p => location.pathname.startsWith(p)) ? 'text-am-600 dark:text-am-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-am-600 dark:hover:text-am-400';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl shadow-lg">
                AM
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">AM IMPACT</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider">GROUP</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8 items-center">
              
              {/* AM ACADEMY DROPDOWN */}
              <div className="relative group">
                <button className={`flex items-center py-2 ${isParentActive(['/academy', '/learn', '/sap', '/jobs', '/meetups', '/sap-community'])}`}>
                  AM Academy <ChevronDown size={14} className="ml-1 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute left-0 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl py-2 hidden group-hover:block border border-slate-100 dark:border-slate-700 top-full">
                  <Link to="/academy" className="block px-4 py-2 text-sm text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-700">Overview</Link>
                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                  
                  {/* ServiceNow Grouping */}
                  <div className="px-4 py-1 text-xs font-semibold text-am-600 dark:text-am-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 mx-1 rounded">ServiceNow</div>
                  <Link to="/learn" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-am-50 dark:hover:bg-slate-700 hover:text-am-600">
                    <Cloud size={14} className="mr-2"/> Learning Hub
                  </Link>
                  <Link to="/jobs" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-am-50 dark:hover:bg-slate-700 hover:text-am-600">
                    <BriefcaseIcon /> Job Board
                  </Link>
                  <Link to="/meetups" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-am-50 dark:hover:bg-slate-700 hover:text-am-600">
                    <Users size={14} className="mr-2"/> Community & Events
                  </Link>
                  
                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>

                  {/* SAP Grouping */}
                  <div className="px-4 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 mx-1 rounded mt-1">SAP</div>
                  <Link to="/sap" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600">
                    <Database size={14} className="mr-2"/> SAP Wing
                  </Link>
                  <Link to="/sap-community" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600">
                    <Calendar size={14} className="mr-2"/> Community & Events
                  </Link>
                </div>
              </div>

              <Link to="/marketing" className={isActive('/marketing')}>AM Marketing</Link>
              <Link to="/foods" className={isActive('/foods')}>AM Foods</Link>
              <Link to="/tech" className={isActive('/tech')}>AM Tech</Link>
              
              <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
              </button>

              <Link to="/contact" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full font-medium hover:opacity-90 transition shadow-md">
                Contact Us
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center space-x-4">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} className="text-yellow-400" />}
              </button>
              <button className="text-slate-700 dark:text-slate-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-2 shadow-lg h-[calc(100vh-80px)] overflow-y-auto">
            <Link to="/" className="block py-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 mb-2">Group Home</Link>
            
            <div className="py-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">AM Academy</span>
              <div className="pl-4 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                <Link to="/academy" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 font-bold">Academy Overview</Link>
                
                <div className="pt-2 text-xs text-am-600 dark:text-am-400 font-bold">ServiceNow</div>
                <Link to="/learn" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 pl-2">Learning Hub</Link>
                <Link to="/jobs" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 pl-2">Jobs</Link>
                <Link to="/meetups" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 pl-2">Community & Events</Link>
                
                <div className="pt-2 text-xs text-blue-600 dark:text-blue-400 font-bold">SAP</div>
                <Link to="/sap" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 pl-2">SAP Wing</Link>
                <Link to="/sap-community" onClick={() => setIsMenuOpen(false)} className="block text-sm text-slate-700 dark:text-slate-300 py-1 pl-2">Community & Events</Link>
              </div>
            </div>

            <Link to="/marketing" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-300">AM Marketing</Link>
            <Link to="/foods" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-300">AM Foods</Link>
            <Link to="/tech" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-300">AM Tech</Link>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-slate-500">Admin Console</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t-4 border-slate-700">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <div className="w-8 h-8 bg-white text-slate-900 rounded flex items-center justify-center font-bold">
                AM
              </div>
              <span className="text-white font-bold text-lg">AM IMPACT GROUP</span>
            </div>
            <p className="text-sm leading-relaxed mb-4 text-slate-400">
              A diversified conglomerate building ecosystems in Education, Marketing, Food, and Technology.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Divisions</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/academy" className="hover:text-white transition">AM Academy</Link></li>
              <li><Link to="/marketing" className="hover:text-white transition">AM Marketing</Link></li>
              <li><Link to="/foods" className="hover:text-white transition">AM Foods</Link></li>
              <li><Link to="/tech" className="hover:text-white transition">AM Tech</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">ServiceNow Hub</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/learn" className="hover:text-white transition">Learning Paths</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition">Job Openings</Link></li>
              <li><Link to="/meetups" className="hover:text-white transition">Community Meetups</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">SAP Hub</h3>
            <ul className="space-y-2 text-sm text-slate-400">
               <li><Link to="/sap" className="hover:text-white transition">SAP Overview</Link></li>
               <li><Link to="/sap-community" className="hover:text-white transition">Events & Community</Link></li>
            </ul>
            <div className="flex flex-col gap-2 text-xs text-slate-500 mt-4">
              <div className="flex items-center">
                <Eye size={14} className="mr-2" />
                Page views: <span id="view-count" className="ml-1 text-slate-300 font-mono">{pageViews}</span>
              </div>
              <Link to="/admin" className="flex items-center hover:text-white transition">
                <Shield size={14} className="mr-2" />
                Admin Console
              </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} AM Impact Group Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

export default Layout;