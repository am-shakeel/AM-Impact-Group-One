
import React, { useEffect, useState } from 'react';
import { getJobs } from '../services/mockDb';
import { Job } from '../types';
import { MapPin, Briefcase, Clock, Search } from 'lucide-react';

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then(data => {
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Job Openings</h1>
            <p className="text-slate-600 flex items-center gap-2 mt-1">
              <span className="h-px w-8 bg-am-600 inline-block"></span>
              Curated by AM Shakeel
            </p>
          </div>
          <div className="w-full md:w-1/3 mt-4 md:mt-0 relative">
            <input 
              type="text"
              placeholder="Search title, company, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-am-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading jobs...</div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-am-400 transition flex flex-col md:flex-row justify-between md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                    <div className="text-lg text-am-700 font-medium mb-2">{job.company}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center"><MapPin size={16} className="mr-1" /> {job.location}</span>
                      <span className="flex items-center"><Briefcase size={16} className="mr-1" /> {job.experience}</span>
                      <span className="flex items-center"><Clock size={16} className="mr-1" /> Posted: {job.postedDate}</span>
                    </div>
                    <p className="mt-3 text-slate-600 text-sm max-w-2xl">{job.description}</p>
                  </div>
                  <a 
                    href={job.applyLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-am-600 transition whitespace-nowrap inline-block text-center"
                  >
                    Apply Now
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
