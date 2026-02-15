
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Megaphone, Utensils, Cpu, ChevronRight } from 'lucide-react';
import { getProfile } from '../services/mockDb';
import { UserProfile } from '../types';

// Extend Window interface for LinkedIn script
declare global {
  interface Window {
    LI: any;
  }
}

// Using a reliable placeholder service for the logo since local asset is missing
const AM_LOGO_PATH = "https://ui-avatars.com/api/?name=AM&background=0284c7&color=fff&size=512&bold=true";

const Home: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data);
    });
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Parent Hero Section */}
      <section className="bg-slate-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-am-900 to-slate-900 opacity-80"></div>
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-am-500 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-marketing-500 rounded-full filter blur-[80px] opacity-20"></div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
          <img 
            src={AM_LOGO_PATH} 
            alt="AM Shakeel Logo" 
            className="w-32 h-auto mx-auto mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-fade-in-up rounded-2xl" 
          />
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
            Empowering Futures. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-am-400 via-marketing-500 to-tech-500">
              Innovating Business.
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            I am Shakeel. This platform bridges Education, Marketing, Food, and Technology. Welcome to my digital ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/academy" className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition flex items-center justify-center">
               Explore Initiatives
             </Link>
             <Link to="/about" className="border border-slate-600 text-white px-8 py-3 rounded-full font-semibold hover:border-white transition flex items-center justify-center">
               About Me
             </Link>
          </div>
        </div>
      </section>

      {/* Divisions Grid (Bento Box Style) */}
      <section className="py-20 container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* AM Academy */}
          <Link to="/academy" className="group bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-am-500 dark:hover:border-am-500 transition-all hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
               <BookOpen size={120} className="text-am-600" />
             </div>
             <div className="w-12 h-12 bg-am-100 dark:bg-am-900/30 text-am-600 rounded-xl flex items-center justify-center mb-6">
               <BookOpen size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AM Academy</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-6">Bridging Education & Employment. My curated paths for ServiceNow and SAP mastery.</p>
             <span className="text-am-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
               Visit Education Hub <ChevronRight size={16} />
             </span>
          </Link>

          {/* AM Marketing */}
          <Link to="/marketing" className="group bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-marketing-500 dark:hover:border-marketing-500 transition-all hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
               <Megaphone size={120} className="text-marketing-600" />
             </div>
             <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-marketing-600 rounded-xl flex items-center justify-center mb-6">
               <Megaphone size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AM Marketing</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-6">Amplify Your Impact. Strategic ideas on branding, events, and community building.</p>
             <span className="text-marketing-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
               Explore Services <ChevronRight size={16} />
             </span>
          </Link>

          {/* AM Foods */}
          <Link to="/foods" className="group bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-foods-500 dark:hover:border-foods-500 transition-all hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
               <Utensils size={120} className="text-foods-600" />
             </div>
             <div className="w-12 h-12 bg-lime-100 dark:bg-lime-900/30 text-foods-600 rounded-xl flex items-center justify-center mb-6">
               <Utensils size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AM Foods</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-6">Taste of Tradition. Exploring cloud kitchens and modern culinary ventures.</p>
             <span className="text-foods-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
               View Concepts <ChevronRight size={16} />
             </span>
          </Link>

          {/* AM Tech */}
          <Link to="/tech" className="group bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 hover:border-tech-500 dark:hover:border-tech-500 transition-all hover:-translate-y-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
               <Cpu size={120} className="text-tech-600" />
             </div>
             <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-tech-600 rounded-xl flex items-center justify-center mb-6">
               <Cpu size={24} />
             </div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AM Tech</h2>
             <p className="text-slate-600 dark:text-slate-400 mb-6">Automating the Future. My thoughts and projects on AI, workflows, and software.</p>
             <span className="text-tech-600 font-bold flex items-center text-sm group-hover:translate-x-2 transition-transform">
               See Solutions <ChevronRight size={16} />
             </span>
          </Link>

        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center max-w-4xl">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
             {profile ? profile.headline : 'About Me'}
           </h2>
           
           <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 whitespace-pre-wrap line-clamp-4">
             {profile ? profile.bio : "Loading profile..."}
           </p>
           
           <Link to="/about" className="inline-flex items-center text-am-600 font-bold hover:text-am-800 hover:underline">
              Read full story and initiatives <ArrowRight size={18} className="ml-2" />
           </Link>

           {/* Stats */}
           {profile && profile.stats && (
             <div className="flex flex-wrap justify-center gap-8 mt-12 border-t border-slate-100 dark:border-slate-800 pt-8">
                {profile.stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </section>

    </div>
  );
};

export default Home;
