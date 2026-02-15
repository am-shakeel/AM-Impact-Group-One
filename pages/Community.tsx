
import React, { useEffect, useState } from 'react';
import { getNetworks } from '../services/mockDb';
import { NetworkGroup } from '../types';
import { MessageCircle, Linkedin, Send } from 'lucide-react';

const Community: React.FC = () => {
  const [networks, setNetworks] = useState<NetworkGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNetworks().then(data => {
      setNetworks(data);
      setLoading(false);
    });
  }, []);

  const getPlatformIcon = (platform: string) => {
    if (platform === 'WhatsApp') return <MessageCircle size={32} className="text-green-500" />;
    if (platform === 'LinkedIn') return <Linkedin size={32} className="text-blue-600" />;
    return <Send size={32} className="text-sky-500" />;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect with the Community</h1>
          <p className="text-slate-600">Join the conversation where it happens.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading groups...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {networks.map(group => (
              <a 
                key={group.id} 
                href={group.link} 
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition flex items-center group"
                onClick={(e) => e.preventDefault()} // Prevent actual navigation for demo
              >
                <div className="mr-6 bg-slate-50 p-4 rounded-full group-hover:bg-slate-100 transition">
                  {getPlatformIcon(group.platform)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-am-600 transition">{group.name}</h3>
                  <div className="text-sm text-slate-500 font-medium mb-1">{group.platform} Group</div>
                  <div className="text-xs bg-am-100 text-am-700 px-2 py-0.5 rounded inline-block">
                    {group.members} Members
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center">
          <h2 className="text-xl font-bold mb-4">Community Guidelines</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            These communities are focused on professional growth. We encourage knowledge sharing, 
            mentorship, and job referrals. Please keep conversations respectful and relevant to ServiceNow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Community;
