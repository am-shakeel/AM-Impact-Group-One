import React from 'react';
import { Database, Server, FileText, Layers, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sap: React.FC = () => {
  const modules = [
    {
      title: 'SAP FICO',
      desc: 'Financial Accounting and Controlling. Master balance sheets, G/L, AP, and AR.',
      icon: <FileText size={24} />
    },
    {
      title: 'SAP MM',
      desc: 'Material Management. Handle procurement, inventory management, and invoice verification.',
      icon: <Layers size={24} />
    },
    {
      title: 'SAP ABAP',
      desc: 'Advanced Business Application Programming. Build reports, interfaces, forms, and workflows.',
      icon: <Server size={24} />
    },
    {
      title: 'SAP S/4HANA',
      desc: 'The next-gen ERP business suite. Learn migration and implementation strategies.',
      icon: <Database size={24} />
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="inline-flex items-center bg-blue-800 border border-blue-700 rounded-full px-3 py-1 text-sm mb-6">
                <Database size={16} className="mr-2" /> AM Academy SAP Wing
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Master the World's <br/> <span className="text-blue-400">#1 ERP Solution</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                From functional modules like FICO and MM to technical ABAP programming. 
                Get enterprise-ready with AM Impact's rigorous SAP curriculum.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                  Download Syllabus
                </button>
                <button className="bg-blue-800 text-white border border-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                  Talk to Counselor
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               {modules.map((mod, i) => (
                 <div key={i} className="bg-blue-800/50 backdrop-blur-sm p-6 rounded-xl border border-blue-700 hover:bg-blue-800 transition">
                    <div className="text-blue-300 mb-3">{mod.icon}</div>
                    <h3 className="font-bold text-white mb-1">{mod.title}</h3>
                    <p className="text-xs text-blue-200">{mod.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Path */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Learn SAP?</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">77% of the world's transaction revenue touches an SAP system.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border-t-4 border-blue-600 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">High Demand</h3>
              <p className="text-slate-600 dark:text-slate-400">Global MNCs like Accenture, Capgemini, and Deloitte constantly hire SAP consultants.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border-t-4 border-blue-600 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">High Packages</h3>
              <p className="text-slate-600 dark:text-slate-400">SAP Consultants are among the highest-paid IT professionals, with seniors earning 20LPA+.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border-t-4 border-blue-600 text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Stability</h3>
              <p className="text-slate-600 dark:text-slate-400">Enterprise systems are long-term investments, offering incredible job security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-slate-100 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Course Highlights</h2>
             <ul className="space-y-4">
               {[
                 '60+ Hours of Live Instructor-led Training',
                 'Access to SAP Server for 3 Months',
                 'Real-time Implementation Project',
                 'Resume Building & Mock Interviews',
                 'Certification Guidance'
               ].map((item, i) => (
                 <li key={i} className="flex items-center text-slate-700 dark:text-slate-300">
                   <CheckCircle className="text-green-500 mr-3" size={20} />
                   {item}
                 </li>
               ))}
             </ul>
             <div className="mt-8 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
               <span className="text-sm text-slate-500 dark:text-slate-400 block mb-1">Next Batch Starts:</span>
               <span className="text-xl font-bold text-blue-900 dark:text-blue-400">November 25, 2023</span>
             </div>
          </div>
          <div className="md:w-1/2 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Request a Callback</h3>
             <form className="space-y-4">
               <input type="text" placeholder="Full Name" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:bg-slate-900 dark:text-white" />
               <input type="email" placeholder="Email Address" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:bg-slate-900 dark:text-white" />
               <input type="tel" placeholder="Phone Number" className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:bg-slate-900 dark:text-white" />
               <select className="w-full border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 dark:bg-slate-900 dark:text-white">
                 <option>Interested Module...</option>
                 <option>SAP FICO</option>
                 <option>SAP MM</option>
                 <option>SAP ABAP</option>
               </select>
               <button className="w-full bg-blue-800 text-white py-3 rounded-lg font-bold hover:bg-blue-900">
                 Book Free Demo
               </button>
             </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sap;