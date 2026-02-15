
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Users, Award, Eye, Shield, Sun, Moon, ChevronDown, Cloud, Database, Calendar, Youtube, Linkedin, PlaySquare, Mail, Phone, MessageSquare, Loader2, CheckCircle, ArrowRight, Github, Twitter } from 'lucide-react';
import { incrementPageView, submitContactForm } from '../services/mockDb';

// Using a reliable placeholder service for the logo since local asset is missing
const AM_LOGO_PATH = "https://ui-avatars.com/api/?name=AM&background=0284c7&color=fff&size=128&bold=true";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageViews, setPageViews] = useState<number>(0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const trackView = async () => {
      // Changed to global increment (no arguments passed)
      const count = await incrementPageView();
      setPageViews(count);
    };
    trackView();
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    try {
      await submitContactForm(contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setContactSuccess(false);
        setShowContactModal(false);
      }, 3000);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const isActive = (path: string) => location.pathname === path ? 'text-am-600 dark:text-am-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-am-600 dark:hover:text-am-400';
  const isParentActive = (paths: string[]) => paths.some(p => location.pathname.startsWith(p)) ? 'text-am-600 dark:text-am-400 font-bold' : 'text-slate-600 dark:text-slate-300 hover:text-am-600 dark:hover:text-am-400';

  // Determine Brand Title based on current path
  const getBrandInfo = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '') {
      return { title: 'AM SHAKEEL', subtitle: 'DIGITAL HUB', link: '/' };
    }
    
    // Academy Section
    if (
        path.startsWith('/academy') || 
        path.startsWith('/learn') || 
        path.startsWith('/jobs') || 
        path.startsWith('/meetups') || 
        path.startsWith('/interview') || 
        path.startsWith('/events') || 
        path.startsWith('/community') || 
        path.startsWith('/sap') ||
        path.startsWith('/referral') ||
        path.startsWith('/job-mela')
    ) {
      return { title: 'AM ACADEMY', subtitle: 'EDUCATION HUB', link: '/academy' };
    }

    // Marketing Section
    if (path.startsWith('/marketing')) {
      return { title: 'AM MARKETING', subtitle: 'DIGITAL & EVENTS', link: '/marketing' };
    }

    // Foods Section
    if (path.startsWith('/foods')) {
      return { title: 'AM FOODS', subtitle: 'CULINARY', link: '/foods' };
    }

    // Tech Section
    if (path.startsWith('/tech')) {
      return { title: 'AM TECH', subtitle: 'SOLUTIONS', link: '/tech' };
    }

    // Admin
    if (path.startsWith('/admin')) {
      return { title: 'AM ADMIN', subtitle: 'CONSOLE', link: '/admin' };
    }

    // Default fallback
    return { title: 'AM SHAKEEL', subtitle: 'DIGITAL HUB', link: '/' };
  };

  const brand = getBrandInfo();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={brand.link} className="flex items-center space-x-3 group">
              <img 
                src={AM_LOGO_PATH} 
                alt="AM Logo" 
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform rounded-lg" 
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none tracking-tight">{brand.title}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider">{brand.subtitle}</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8 items-center">
              
              <Link to="/about" className={isActive('/about')}>About Me</Link>

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

              <button 
                onClick={() => setShowContactModal(true)}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-full font-medium hover:opacity-90 transition shadow-md"
              >
                Contact Me
              </button>
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
            <Link to="/" className="block py-2 font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 mb-2">Home Hub</Link>
            
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 font-medium text-slate-700 dark:text-slate-300">About Me</Link>

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
            
            <button 
              onClick={() => { setIsMenuOpen(false); setShowContactModal(true); }}
              className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-300"
            >
              Contact Me
            </button>
            
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

      {/* Modern Mega Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t-2 border-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand & Identity */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={AM_LOGO_PATH} 
                  alt="AM Logo" 
                  className="w-12 h-12 object-contain rounded-xl shadow-lg shadow-am-900/20" 
                />
                <div>
                  <div className="text-white font-black text-xl uppercase tracking-tighter leading-none">AM Shakeel</div>
                  <div className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Digital Hub</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-400">
                A personal ecosystem integrating Technology, Education, and Culinary Arts. Building sustainable communities for the future.
              </p>
              
              <div className="flex gap-3">
                <SocialIcon icon={<Linkedin size={18} />} href="https://linkedin.com/in/amshakeel" label="LinkedIn" color="hover:bg-[#0077b5]" />
                <SocialIcon icon={<Youtube size={18} />} href="https://youtube.com/@amshakeel" label="YouTube" color="hover:bg-[#FF0000]" />
                <SocialIcon icon={<Twitter size={18} />} href="#" label="Twitter" color="hover:bg-[#1DA1F2]" />
                <SocialIcon icon={<Github size={18} />} href="#" label="GitHub" color="hover:bg-[#333]" />
              </div>
            </div>

            {/* Column 2: Business Divisions */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider flex items-center">
                <span className="w-8 h-0.5 bg-am-600 mr-3"></span> Initiatives
              </h3>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/academy" label="AM Academy" icon={<Cloud size={14}/>} />
                <FooterLink to="/marketing" label="AM Marketing" icon={<Users size={14}/>} />
                <FooterLink to="/foods" label="AM Foods" icon={<CheckCircle size={14}/>} />
                <FooterLink to="/tech" label="AM Tech" icon={<Database size={14}/>} />
              </ul>
            </div>

            {/* Column 3: Community & Learning */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider flex items-center">
                <span className="w-8 h-0.5 bg-green-600 mr-3"></span> Community
              </h3>
              <ul className="space-y-3 text-sm">
                <FooterLink to="/learn" label="ServiceNow Paths" />
                <FooterLink to="/sap" label="SAP Wing" />
                <FooterLink to="/jobs" label="Job Openings" badge="New" />
                <FooterLink to="/meetups" label="Upcoming Events" />
                <FooterLink to="/about" label="About Shakeel" />
              </ul>
            </div>

            {/* Column 4: Newsletter & Contact */}
            <div>
              <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Stay Updated</h3>
              <p className="text-xs text-slate-500 mb-4">Join 1,200+ professionals receiving weekly insights.</p>
              
              <div className="flex flex-col gap-3 mb-6">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-am-600 transition"
                />
                <button className="bg-am-600 hover:bg-am-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg shadow-am-900/20">
                  Subscribe
                </button>
              </div>

              <button onClick={() => setShowContactModal(true)} className="flex items-center text-sm text-slate-400 hover:text-white transition group">
                <Mail size={16} className="mr-2 group-hover:text-am-400 transition-colors" /> Contact Support
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
              <span>&copy; {new Date().getFullYear()} AM Shakeel. All rights reserved.</span>
              <span className="hidden md:inline text-slate-800">|</span>
              <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center" title="Total Page Views">
                <Eye size={12} className="mr-2 text-am-600" />
                <span className="font-mono text-slate-500">{pageViews.toLocaleString()}</span>
              </div>
              <Link to="/admin" className="flex items-center hover:text-white transition px-3 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700">
                <Shield size={12} className="mr-2" />
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CONTACT MODAL */}
      {showContactModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border border-slate-200 dark:border-slate-800">
              <button 
                 onClick={() => setShowContactModal(false)}
                 className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white z-10"
              >
                 <X size={24} />
              </button>
              
              <div className="bg-am-600 p-6 text-center text-white">
                 <Mail size={40} className="mx-auto mb-2 opacity-90" />
                 <h2 className="text-2xl font-bold">Get in Touch</h2>
                 <p className="text-am-100 text-sm">Have a question? We'd love to hear from you.</p>
              </div>

              <div className="p-6">
                 {contactSuccess ? (
                    <div className="text-center py-8">
                       <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle size={32} />
                       </div>
                       <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Sent!</h3>
                       <p className="text-slate-600 dark:text-slate-400 mt-2">Thank you for contacting us. We will get back to you shortly.</p>
                    </div>
                 ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                          <input 
                             type="text" 
                             required
                             className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                             value={contactForm.name}
                             onChange={e => setContactForm({...contactForm, name: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                          <input 
                             type="email" 
                             required
                             className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                             value={contactForm.email}
                             onChange={e => setContactForm({...contactForm, email: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                          <input 
                             type="tel" 
                             className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                             value={contactForm.phone}
                             onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                          <textarea 
                             required
                             rows={3}
                             className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none resize-none"
                             value={contactForm.message}
                             onChange={e => setContactForm({...contactForm, message: e.target.value})}
                          />
                       </div>
                       <button 
                          type="submit" 
                          disabled={isSubmittingContact}
                          className="w-full bg-am-900 text-white py-3 rounded-lg font-bold hover:bg-am-800 transition flex items-center justify-center disabled:opacity-70"
                       >
                          {isSubmittingContact ? <Loader2 className="animate-spin" /> : 'Send Message'}
                       </button>
                    </form>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Helper Components for Footer
const SocialIcon = ({ icon, href, label, color }: { icon: React.ReactNode, href: string, label: string, color: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 transition-all duration-300 ${color} hover:text-white hover:scale-110`}
    aria-label={label}
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label, icon, badge }: { to: string, label: string, icon?: React.ReactNode, badge?: string }) => (
  <li>
    <Link to={to} className="group flex items-center text-slate-400 hover:text-white transition">
      {icon && <span className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity text-am-500">{icon}</span>}
      <span className="group-hover:translate-x-1 transition-transform inline-block">{label}</span>
      {badge && <span className="ml-2 text-[10px] bg-am-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">{badge}</span>}
    </Link>
  </li>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);

export default Layout;
