import React from 'react';
import { Users, Gift, CheckCircle } from 'lucide-react';

const Referral: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-am-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">AM Impact Referral Program</h1>
          <p className="text-am-100 text-lg">Help a friend land their dream job and get rewarded.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-am-100 text-am-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">1. Refer a Friend</h3>
            <p className="text-slate-600 text-sm">Submit the resume of a qualified ServiceNow professional.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-am-100 text-am-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">2. Successful Placement</h3>
            <p className="text-slate-600 text-sm">Our recruitment team places them in a top MNC.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-am-100 text-am-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift size={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">3. Earn Rewards</h3>
            <p className="text-slate-600 text-sm">Get a referral bonus once they complete 90 days.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800">Ready to Refer?</h2>
          <p className="text-slate-600 mb-8">Send resumes directly to our recruitment team.</p>
          <a href="mailto:referrals@amimpact.com" className="bg-am-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-am-700 transition">
            Email Resume
          </a>
          <p className="mt-4 text-xs text-slate-400">Subject: Referral - [Candidate Name] - [Role]</p>
        </div>
      </div>
    </div>
  );
};

export default Referral;