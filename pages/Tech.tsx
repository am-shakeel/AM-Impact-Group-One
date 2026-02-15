
import React, { useState, useEffect } from 'react';
import { Cpu, Workflow, Database, Code, Terminal } from 'lucide-react';
import { getInitiatives } from '../services/mockDb';
import { Initiative } from '../types';

const Tech: React.FC = () => {
  const [content, setContent] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInitiatives('tech').then(data => {
        setContent(data);
        setLoading(false);
    });
  }, []);

  const getIcon = (name: string) => {
    switch(name.toLowerCase()) {
        case 'workflow': return <Workflow size={32} className="text-tech-600 mb-4" />;
        case 'database': return <Database size={32} className="text-tech-600 mb-4" />;
        case 'code': return <Code size={32} className="text-tech-600 mb-4" />;
        default: return <Terminal size={32} className="text-tech-600 mb-4" />;
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-tech-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
            <Cpu size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">AM Tech</h1>
          <p className="text-xl text-violet-100 max-w-2xl">Automating the Future. We build intelligent software solutions that reduce overhead and increase efficiency.</p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 container mx-auto px-4">
        {loading ? (
             <div className="text-center py-10 text-slate-500">Loading solutions...</div>
        ) : content.length > 0 ? (
           <div className="grid md:grid-cols-3 gap-8">
              {content.map(item => (
                 <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-xl border-t-4 border-tech-500 shadow-sm">
                    {getIcon(item.iconName || '')}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                 </div>
              ))}
           </div>
        ) : (
           <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border-t-4 border-tech-500 shadow-sm">
                <Workflow size={32} className="text-tech-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Workflow Automation</h3>
                <p className="text-slate-600 dark:text-slate-400">ServiceNow implementation and custom workflow designs to streamline business operations.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border-t-4 border-tech-500 shadow-sm">
                <Database size={32} className="text-tech-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI & ML Solutions</h3>
                <p className="text-slate-600 dark:text-slate-400">Predictive intelligence and chatbot integration to enhance customer experience.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border-t-4 border-tech-500 shadow-sm">
                <Code size={32} className="text-tech-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Custom Development</h3>
                <p className="text-slate-600 dark:text-slate-400">Full-stack web and mobile application development tailored to your enterprise needs.</p>
            </div>
           </div>
        )}
      </section>

      {/* Contact */}
      <section className="bg-white dark:bg-slate-900 py-16 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Need a tech consultation?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl">
            Our architects are ready to help you map out your digital transformation journey.
          </p>
          <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition">
             Book a Consultation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Tech;
