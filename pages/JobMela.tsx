import React from 'react';
import { Calendar, MapPin, Building2 } from 'lucide-react';

const JobMela: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Banner */}
      <div className="relative bg-slate-900 h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-am-600 opacity-20"></div>
        <div className="relative z-10 text-center px-4">
          <div className="inline-block bg-white text-slate-900 px-4 py-1 rounded mb-4 font-bold text-sm tracking-widest uppercase">
            Powered by AM Impact Group
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">MEGA JOB MELA 2023</h1>
          <p className="text-xl text-am-300">Hyderabad Edition</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Event Details</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <Calendar className="text-am-500 mr-3 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Date & Time</div>
                    <div className="text-slate-600">December 05, 2023</div>
                    <div className="text-slate-600">9:00 AM - 5:00 PM IST</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-am-500 mr-3 mt-1" />
                  <div>
                    <div className="font-bold text-slate-900">Venue</div>
                    <div className="text-slate-600">Hyderabad Convention Center, Hitech City</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Join the largest gathering of ServiceNow professionals in the region. Whether you are a fresh graduate looking 
                to start your journey or an experienced architect seeking a new challenge, AM Impact's Job Mela brings opportunities directly to you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Participating Companies</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-400 font-bold">
                    <Building2 size={24} className="mr-2 opacity-50"/> Logo {i}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-am-500">
              <h3 className="text-xl font-bold mb-4">Registration</h3>
              <p className="text-sm text-slate-600 mb-6">Entry is free for AM Impact Community members. Walk-ins allowed but registration is preferred.</p>
              <button className="w-full bg-am-600 text-white py-3 rounded-lg font-bold hover:bg-am-700 transition mb-3">
                Register as Candidate
              </button>
              <button className="w-full bg-white border border-slate-300 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-50 transition">
                Company Registration
              </button>
            </div>

            <div className="bg-gradient-to-br from-am-800 to-slate-900 p-6 rounded-xl text-white">
              <h3 className="font-bold text-lg mb-2">Prepare for Success</h3>
              <p className="text-sm text-am-100 mb-4">Check out our Interview Prep section before attending.</p>
              <a href="#/interview" className="text-sm font-bold text-white underline hover:text-am-300">Go to Interview Prep &rarr;</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMela;