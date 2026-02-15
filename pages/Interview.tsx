
import React, { useEffect, useState } from 'react';
import { getLearningItems } from '../services/mockDb';
import { LearningItem } from '../types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const Interview: React.FC = () => {
  const [questions, setQuestions] = useState<LearningItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningItems().then(data => {
      // Filter only interview questions
      setQuestions(data.filter(i => i.type === 'interview'));
      setLoading(false);
    });
  }, []);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const getRoleFromSlug = (slug: string) => {
    if (slug.startsWith('dev')) return 'Developer';
    if (slug.startsWith('arch')) return 'Architect';
    if (slug.startsWith('ba')) return 'Business Analyst';
    if (slug.startsWith('po')) return 'Product Owner';
    return 'General';
  };

  const filteredQuestions = roleFilter === 'All' 
    ? questions 
    : questions.filter(q => getRoleFromSlug(q.targetSlug) === roleFilter);

  // Derive unique roles from the data
  const roles = ['All', ...Array.from(new Set(questions.map(q => getRoleFromSlug(q.targetSlug))))];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interview Questions Vault</h1>
          <p className="text-slate-600 dark:text-slate-400">Real questions from top companies like Accenture, Deloitte, and more.</p>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-500 dark:text-slate-400" />
            <select 
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg focus:outline-none focus:border-am-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading questions...</div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map(q => (
                <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <button 
                    className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
                    onClick={() => toggleQuestion(q.id)}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded uppercase tracking-wide">
                          ServiceNow
                        </span>
                        <span className="text-xs font-semibold text-am-600 dark:text-am-400 bg-am-50 dark:bg-am-900/20 px-2 py-1 rounded">
                          {getRoleFromSlug(q.targetSlug)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{q.title}</h3>
                    </div>
                    {openId === q.id ? <ChevronUp className="text-am-500" /> : <ChevronDown className="text-slate-400" />}
                  </button>
                  
                  {openId === q.id && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 relative">
                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
                        <span className="text-6xl font-black text-slate-900 dark:text-white transform -rotate-12 whitespace-nowrap">AM SHAKEEL</span>
                      </div>
                      
                      <div className="relative z-10">
                        <p className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-1">Suggested Answer:</p>
                        <p className="text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{q.content || "No answer provided yet."}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">No questions found for this role.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
