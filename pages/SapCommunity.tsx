import React from 'react';
import { Calendar, Users, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const SapCommunity: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center bg-blue-800 border border-blue-700 rounded-full px-3 py-1 text-sm mb-6">
            <Users size={16} className="mr-2" /> AM SAP Community
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Connect, Collaborate, Scale.</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Join a growing network of SAP professionals. Events, webinars, and study groups coming soon.
          </p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="container mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">SAP Events Dashboard</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
               <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Calendar size={48} className="mx-auto text-blue-500 mb-4 opacity-50" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Upcoming Webinars</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Data loading... We are finalizing the schedule for our FICO and ABAP masterclasses.</p>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Users size={48} className="mx-auto text-green-500 mb-4 opacity-50" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">Study Groups</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Peer-to-peer learning groups will be available shortly.</p>
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Get Notified</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Be the first to know when we launch our SAP events.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                    <MessageCircle size={20} className="mr-2" /> Join WhatsApp Group
                 </button>
                 <button className="flex items-center justify-center bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition">
                    <Mail size={20} className="mr-2" /> Join Mailing List
                 </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Looking for ServiceNow events? <Link to="/meetups" className="text-am-600 dark:text-am-400 font-bold hover:underline">Go to ServiceNow Hub</Link>
        </p>
      </section>
    </div>
  );
};

export default SapCommunity;