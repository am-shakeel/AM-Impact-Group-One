import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, Briefcase, Users, Zap, Calendar, Database, Cloud, Layers, Server } from 'lucide-react';

const Academy: React.FC = () => {
  // scalable configuration for future technologies
  const techStreams = [
    {
      id: 'servicenow',
      title: 'ServiceNow',
      description: 'The complete ecosystem for Flow Designer, ITSM, HRSD, and CAD certification.',
      icon: <Cloud size={40} />,
      color: 'bg-am-600',
      textColor: 'text-am-600',
      borderColor: 'border-am-200',
      link: '/learn', // Existing ServiceNow hub
      features: ['Admin & Dev Paths', 'Job Market', 'Live Meetups']
    },
    {
      id: 'sap',
      title: 'SAP',
      description: 'Master enterprise resource planning with modules on FICO, ABAP, MM, and SD.',
      icon: <Database size={40} />,
      color: 'bg-blue-800',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      link: '/sap', // New SAP hub
      features: ['S/4HANA', 'ABAP Programming', 'Community Events']
    },
    {
      id: 'exams',
      title: 'Competitive Exams',
      description: 'Preparation for Banking, SSC, and State Government technical roles.',
      icon: <Book size={40} />,
      color: 'bg-green-600',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      link: '#', // Placeholder for future
      features: ['Mock Tests', 'Syllabus Coverage', 'Expert Faculty'],
      comingSoon: true
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 md:py-28 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block bg-white/10 text-white/90 font-semibold px-4 py-1 rounded-full text-sm mb-6 border border-white/20 backdrop-blur-sm">
            Excellence in Technical Education
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Choose Your <span className="text-am-400">Technology Stack</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            AM Academy provides industry-standard training across multiple domains. Select your path below to access specialized curriculum, jobs, and community.
          </p>
        </div>
      </section>

      {/* Technology Streams Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {techStreams.map((tech) => (
              <div key={tech.id} className={`bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border ${tech.borderColor} dark:border-slate-800 flex flex-col hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden`}>
                {tech.comingSoon && (
                  <div className="absolute top-4 right-4 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded">
                    COMING SOON
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl ${tech.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                  {tech.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tech.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
                  {tech.description}
                </p>

                <div className="space-y-3 mb-8">
                  {tech.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Zap size={16} className={`mr-2 ${tech.textColor}`} /> {feature}
                    </div>
                  ))}
                </div>

                <Link 
                  to={tech.link} 
                  className={`w-full block text-center py-3 rounded-xl font-bold transition ${
                    tech.comingSoon 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : `${tech.color} text-white hover:opacity-90 shadow-lg`
                  }`}
                  onClick={(e) => tech.comingSoon && e.preventDefault()}
                >
                  {tech.comingSoon ? 'Launching Soon' : `Enter ${tech.title} Hub`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Features */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">The AM Academy Advantage</h2>
            <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 mx-auto rounded"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Placement Assistance</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Regardless of your technology stream, our dedicated placement cell connects you with top hiring partners and organizes monthly Job Melas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Unified Community</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Join a network of 1200+ professionals. Cross-skill by attending webinars from other technology streams.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Weekend Workshops</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Intensive bootcamps on weekends designed for working professionals looking to upskill or switch careers.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Upcoming Global Events</h3>
              
              <div className="space-y-4 text-left">
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border-l-4 border-am-500">
                   <div className="text-xs font-bold text-am-600 mb-1">SERVICENOW</div>
                   <div className="font-bold text-slate-800 dark:text-white">Vancouver Release Deep Dive</div>
                   <div className="text-sm text-slate-500">Nov 15 • Online</div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border-l-4 border-blue-800">
                   <div className="text-xs font-bold text-blue-800 mb-1">SAP</div>
                   <div className="font-bold text-slate-800 dark:text-white">S/4HANA Migration Strategies</div>
                   <div className="text-sm text-slate-500">Nov 22 • Hyderabad</div>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border-l-4 border-slate-900">
                   <div className="text-xs font-bold text-slate-900 dark:text-slate-300 mb-1">CAREER</div>
                   <div className="font-bold text-slate-800 dark:text-white">Mega Job Mela 2023</div>
                   <div className="text-sm text-slate-500">Dec 05 • Convention Center</div>
                 </div>
              </div>

              <Link to="/events" className="inline-block mt-8 text-am-600 font-bold hover:underline">View All Events &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academy;