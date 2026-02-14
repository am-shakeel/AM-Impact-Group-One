import React, { useEffect, useState } from 'react';
import { getQuestions } from '../services/mockDb';
import { InterviewQuestion } from '../types';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

const Interview: React.FC = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuestions().then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredQuestions = roleFilter === 'All' 
    ? questions 
    : questions.filter(q => q.role === roleFilter);

  const roles = ['All', ...Array.from(new Set(questions.map(q => q.role)))];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Interview Questions Vault</h1>
          <p className="text-slate-600">Real questions from top companies like Accenture, Deloitte, and more.</p>
        </div>

        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-500" />
            <select 
              className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:border-am-500"
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
            {filteredQuestions.map(q => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                <button 
                  className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
                  onClick={() => toggleQuestion(q.id)}
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wide">
                        {q.company}
                      </span>
                      <span className="text-xs font-semibold text-am-600 bg-am-50 px-2 py-1 rounded">
                        {q.role}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{q.question}</h3>
                  </div>
                  {openId === q.id ? <ChevronUp className="text-am-500" /> : <ChevronDown className="text-slate-400" />}
                </button>
                
                {openId === q.id && (
                  <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
                       <span className="text-6xl font-black text-slate-900 transform -rotate-12 whitespace-nowrap">AM IMPACT GROUP</span>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="font-semibold text-sm text-slate-500 mb-1">Suggested Answer:</p>
                      <p className="text-slate-800 leading-relaxed">{q.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;