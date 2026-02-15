
import React, { useEffect, useState } from 'react';
import { Megaphone, Award, TrendingUp, Layout, Activity } from 'lucide-react';
import { getInitiatives } from '../services/mockDb';
import { Initiative } from '../types';

const Marketing: React.FC = () => {
  const [content, setContent] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInitiatives('marketing').then(data => {
        setContent(data);
        setLoading(false);
    });
  }, []);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case 'award': return <Award size={40} className="text-marketing-500 mb-4" />;
        case 'trending': return <TrendingUp size={40} className="text-marketing-500 mb-4" />;
        case 'layout': return <Layout size={40} className="text-marketing-500 mb-4" />;
        default: return <Activity size={40} className="text-marketing-500 mb-4" />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-marketing-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
            <Megaphone size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">AM Marketing</h1>
          <p className="text-xl text-orange-100 max-w-2xl">Amplify Your Impact. We bridge the gap between brands and their audiences through strategic events and digital mastery.</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 container mx-auto px-4">
        {loading ? (
           <div className="text-center py-10 text-slate-500">Loading services...</div>
        ) : content.length > 0 ? (
           <div className="grid md:grid-cols-3 gap-8">
             {content.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition">
                   {getIcon(item.iconName || '')}
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
             ))}
           </div>
        ) : (
           /* Default Content if no DB entries */
           <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition">
                <TrendingUp size={40} className="text-marketing-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Digital Branding</h3>
                <p className="text-slate-600 dark:text-slate-400">SEO, Social Media Management, and Performance Marketing to scale your digital footprint.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition">
                <Award size={40} className="text-marketing-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Corporate Events</h3>
                <p className="text-slate-600 dark:text-slate-400">End-to-end management of Job Melas, Tech Conferences, and Corporate Retreats.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition">
                <Layout size={40} className="text-marketing-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sponsorships</h3>
                <p className="text-slate-600 dark:text-slate-400">Connecting high-value brands with targeted communities for maximum ROI.</p>
            </div>
           </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-white dark:bg-slate-900 py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to grow your brand?</h2>
          <button className="bg-marketing-600 text-white px-8 py-3 rounded-full font-bold hover:bg-marketing-700 transition shadow-lg shadow-marketing-500/30">
            Contact Our Team
          </button>
        </div>
      </section>
    </div>
  );
};

export default Marketing;
