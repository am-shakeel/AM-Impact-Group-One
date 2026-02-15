import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Component, 
  UserSquare2, 
  Briefcase, 
  GraduationCap, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';

interface RoleLevel {
  label: string;
  description: string;
  slug: string;
}

interface RoleCard {
  role: string;
  icon: React.ReactNode;
  color: string;
  lightColor: string;
  levels: RoleLevel[];
}

const Learn: React.FC = () => {
  const roles: RoleCard[] = [
    {
      role: 'Developers',
      icon: <Code2 size={24} />,
      color: 'bg-am-600',
      lightColor: 'bg-am-50 text-am-700 dark:bg-am-900/20 dark:text-am-400',
      levels: [
        { label: 'Freshers', description: 'Zero to CSA. Foundations of the Platform.', slug: 'dev-fresher' },
        { label: '1–2 Years', description: 'Advanced Scripting & Flow Designer mastery.', slug: 'dev-1-2' },
        { label: '3–5 Years', description: 'Integrations, Service Portal & CAD Prep.', slug: 'dev-3-5' },
        { label: '6–8 Years', description: 'Lead Developer: App Engine & Domain Sep.', slug: 'dev-6-8' },
        { label: 'Senior (8+)', description: 'Mastering performance & technical debt.', slug: 'dev-senior' },
      ]
    },
    {
      role: 'Architects',
      icon: <Component size={24} />,
      color: 'bg-violet-600',
      lightColor: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
      levels: [
        { label: '1–2 Years', description: 'Junior Architect: Data modeling & CMDB.', slug: 'arch-1-2' },
        { label: '3–5 Years', description: 'Solutioning complex ITSM/ITOM workflows.', slug: 'arch-3-5' },
        { label: '6–8 Years', description: 'Strategy: IRM, SecOps & Platform Governance.', slug: 'arch-6-8' },
        { label: 'Senior (8+)', description: 'Technical Consultant: Enterprise Ecosystems.', slug: 'arch-senior' },
      ]
    },
    {
      role: 'Business Analysts',
      icon: <UserSquare2 size={24} />,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
      levels: [
        { label: 'Freshers', description: 'Learning Requirement Gathering & SDLC.', slug: 'ba-fresher' },
        { label: '1–2 Years', description: 'Process Mapping: Incident to Change.', slug: 'ba-1-2' },
        { label: '3–5 Years', description: 'Advanced Workshop Facilitation & Stories.', slug: 'ba-3-5' },
        { label: 'Senior', description: 'Strategic BA: Value Streams & KPI Design.', slug: 'ba-senior' },
      ]
    },
    {
      role: 'Product Owners',
      icon: <Briefcase size={24} />,
      color: 'bg-orange-600',
      lightColor: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      levels: [
        { label: '1–2 Years', description: 'Backlog grooming & Sprint planning.', slug: 'po-1-2' },
        { label: '3–5 Years', description: 'Product Vision & Roadmap management.', slug: 'po-3-5' },
        { label: 'Senior', description: 'Platform Owner: C-Suite Alignment & ROI.', slug: 'po-senior' },
      ]
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 bg-am-100 dark:bg-am-900/30 text-am-700 dark:text-am-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <Sparkles size={16} />
            <span>AI-Powered Career Paths</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            ServiceNow <span className="text-am-600 dark:text-am-400">Learning Hub</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Select your persona and experience level to unlock a curated ecosystem of learning paths, interview prep, real-world projects, and job opportunities.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {roles.map((card) => (
            <div key={card.role} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition">
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`${card.color} text-white p-3 rounded-xl shadow-lg`}>
                    {card.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{card.role}</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {card.levels.map((level) => (
                    <Link 
                      key={level.slug}
                      to={`/learn/path/${level.slug}`}
                      className="group p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-am-500 dark:hover:border-am-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${card.lightColor}`}>
                          {level.label}
                        </span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-am-600 group-hover:translate-x-1 transition" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                        {level.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {i}
                    </div>
                  ))}
                  <div className="pl-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    120+ students learning this week
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-am-600 dark:text-am-400">
                  <Zap size={14} className="mr-1" /> View Guide
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Support Stats */}
        <div className="mt-16 grid md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">5k+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Questions Bank</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">200+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Real Use Cases</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">50+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Tie-ups</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">Daily</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Job Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;