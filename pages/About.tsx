
import React, { useEffect, useState } from 'react';
import { getProfile } from '../services/mockDb';
import { UserProfile } from '../types';
import { Award, Calendar, CheckCircle2, MapPin, Target, Linkedin } from 'lucide-react';

const About: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data);
      if (window.LI && window.LI.Profile && window.LI.Profile.refresh) {
         setTimeout(() => window.LI.Profile.refresh(), 500);
      }
    });
  }, []);

  if (!profile) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading profile...</div>;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-20 transition-colors duration-200">
      
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-am-600 rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Meet <span className="text-am-400">Shakeel</span></h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {profile.headline || "Architect. Educator. Entrepreneur. Building ecosystems for the future."}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-10 relative z-20">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
              
              {/* Bio Section */}
              <div className="mb-16">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                      <span className="w-10 h-10 bg-am-100 dark:bg-am-900/30 text-am-600 rounded-full flex items-center justify-center mr-3">
                          <MapPin size={20} />
                      </span>
                      My Story
                  </h2>
                  <div className="prose dark:prose-invert max-w-none text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {profile.bio}
                  </div>
              </div>

              {/* Journey Timeline */}
              {profile.journey && (
                  <div className="mb-16">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                          <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mr-3">
                              <Calendar size={20} />
                          </span>
                          Journey & Milestones
                      </h2>
                      <div className="space-y-0">
                          {profile.journey.split('\n').filter(line => line.trim()).map((step, idx, arr) => (
                              <div key={idx} className="flex gap-4 group">
                                  <div className="flex flex-col items-center">
                                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-6 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] group-hover:scale-110 transition"></div>
                                      {idx !== arr.length - 1 && (
                                          <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-800 my-1"></div>
                                      )}
                                  </div>
                                  <div className="pb-8 pt-3 flex-grow">
                                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition">
                                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Future Plans */}
              {profile.futureGoals && (
                  <div className="mb-16">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                          <span className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mr-3">
                              <Target size={20} />
                          </span>
                          Future Initiatives
                      </h2>
                      <div className="grid gap-4">
                          {profile.futureGoals.split('\n').filter(line => line.trim()).map((goal, idx) => (
                              <div key={idx} className="flex items-start bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 hover:border-green-200 dark:hover:border-green-900 transition">
                                  <CheckCircle2 className="text-green-500 mr-3 mt-1 flex-shrink-0" size={20} />
                                  <span className="text-slate-700 dark:text-slate-300 font-medium">{goal}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Certifications */}
              {profile.certifications && (
                  <div className="mb-16">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                          <span className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full flex items-center justify-center mr-3">
                              <Award size={20} />
                          </span>
                          Certifications & Achievements
                      </h2>
                      <div className="flex flex-wrap gap-3">
                          {profile.certifications.split('\n').filter(line => line.trim()).map((cert, idx) => (
                              <span key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-bold border border-yellow-200 dark:border-yellow-800 flex items-center">
                                  <Award size={14} className="mr-2 opacity-50"/>
                                  {cert}
                              </span>
                          ))}
                      </div>
                  </div>
              )}

              {/* LinkedIn Badge */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0077b5] text-white mb-4">
                      <Linkedin size={24}/>
                  </div>
                  <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">Connect on LinkedIn</h3>
                  {profile.linkedinBadgeHtml ? (
                      <div className="inline-block overflow-hidden shadow-lg rounded-lg bg-white">
                          <div dangerouslySetInnerHTML={{ __html: profile.linkedinBadgeHtml }} />
                      </div>
                  ) : (
                      <p className="text-slate-400 italic">LinkedIn Profile not connected in Admin settings.</p>
                  )}
              </div>

          </div>
      </div>

    </div>
  );
};

export default About;
