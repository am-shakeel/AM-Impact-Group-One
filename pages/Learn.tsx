import React, { useEffect, useState } from 'react';
import { getLearningPaths } from '../services/mockDb';
import { LearningPath, ExperienceLevel } from '../types';
import { BookOpen, Award, Layers } from 'lucide-react';

const Learn: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLearningPaths().then(data => {
      setPaths(data);
      setLoading(false);
    });
  }, []);

  const getLevelColor = (level: ExperienceLevel) => {
    switch (level) {
      case ExperienceLevel.BEGINNER: return 'bg-green-100 text-green-700';
      case ExperienceLevel.INTERMEDIATE: return 'bg-blue-100 text-blue-700';
      case ExperienceLevel.ADVANCED: return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">ServiceNow Learning Hub</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Master the platform with our curated paths. From fundamentals to expert-level architecture.
          </p>
        </div>

        {loading ? (
           <div className="text-center py-20 text-slate-500">Loading resources...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paths.map(path => (
              <div key={path.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(path.level)}`}>
                      {path.level}
                    </span>
                    {path.featured && (
                      <span className="flex items-center text-xs font-bold text-orange-500">
                        <Award size={14} className="mr-1" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{path.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                    {path.description}
                  </p>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Layers size={16} className="mr-2" /> {path.category}
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-500">{path.steps} Modules</span>
                  <button className="text-am-600 font-semibold text-sm hover:underline">
                    Start Path &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 bg-am-900 rounded-2xl p-8 text-center text-white">
          <BookOpen size={48} className="mx-auto mb-4 text-am-500" />
          <h2 className="text-2xl font-bold mb-2">Curated by AM Impact Group</h2>
          <p className="text-slate-300 mb-6">Our experts update these resources weekly to align with the latest ServiceNow releases.</p>
        </div>
      </div>
    </div>
  );
};

export default Learn;