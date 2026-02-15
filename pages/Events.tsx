
import React, { useEffect, useState } from 'react';
import { getEvents } from '../services/mockDb';
import { Event } from '../types';
import { Calendar, MapPin, Video, Users } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const getIcon = (type: string) => {
    if (type === 'Webinar') return <Video size={20} />;
    if (type === 'Job Mela') return <BriefcaseIcon />; // Defined below
    return <Users size={20} />;
  };

  const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Upcoming Events</h1>

        {loading ? (
           <div className="text-center py-20 text-slate-500">Loading events...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition border border-slate-200 flex flex-col">
                <div className="bg-am-600 h-2"></div> {/* Brand Strip */}
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">
                      {getIcon(event.type)} {event.type}
                    </span>
                    <span className="text-sm font-semibold text-am-600 bg-am-50 px-2 py-1 rounded border border-am-100">
                      AM Shakeel
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                  <div className="text-sm text-slate-500 space-y-2 mb-4">
                    <div className="flex items-center"><Calendar size={16} className="mr-2 text-am-500" /> {event.date}</div>
                    <div className="flex items-center"><MapPin size={16} className="mr-2 text-am-500" /> {event.location}</div>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{event.description}</p>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg hover:bg-am-50 hover:text-am-600 hover:border-am-200 transition">
                    RSVP Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
