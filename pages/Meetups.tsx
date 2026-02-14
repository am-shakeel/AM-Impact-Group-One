import React, { useEffect, useState } from 'react';
import { getMeetups, getReservations, registerUser } from '../services/mockDb';
import { Meetup, Reservation } from '../types';
import { Calendar, MapPin, User, Armchair, CheckCircle, Loader2, X } from 'lucide-react';

const Meetups: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [presentMeetup, setPresentMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seatLoading, setSeatLoading] = useState(false);

  // Seat Selection
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Registration Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    linkedin: '',
    sessionPresenter: false,
    presentationTopic: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<Reservation | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getMeetups();
    setMeetups(data);
    const present = data.find(m => m.type === 'Present');
    setPresentMeetup(present || null);
    if (present) {
      refreshReservations(present.id);
    }
    setLoading(false);
  };

  const refreshReservations = async (meetupId: string) => {
    const res = await getReservations(meetupId);
    setReservations(res);
  };

  const handleSeatModalOpen = () => {
    setSeatLoading(true);
    setShowSeatModal(true);
    // Simulate loading delay for seat grid
    setTimeout(() => {
      setSeatLoading(false);
    }, 500);
  };

  const handleSeatSelect = (seat: string) => {
    if (reservations.some(r => r.seatNumber === seat)) return;
    setSelectedSeat(seat);
  };

  const confirmSeat = () => {
    if (selectedSeat) {
      setShowSeatModal(false);
      setShowRegModal(true);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presentMeetup) return;

    // Basic LinkedIn Validation
    if (!formData.linkedin.startsWith('http')) {
      alert('Please enter a valid LinkedIn URL starting with http:// or https://');
      return;
    }

    setSubmitLoading(true);
    try {
      const result = await registerUser({
        meetupId: presentMeetup.id,
        seatNumber: selectedSeat || '',
        name: formData.name,
        email: formData.email,
        company: formData.company,
        linkedin: formData.linkedin,
        sessionPresenter: formData.sessionPresenter,
        presentationTopic: formData.presentationTopic
      });
      
      setSubmitSuccess(result);
      await refreshReservations(presentMeetup.id);
      // Reset form
      setFormData({ name: '', email: '', company: '', linkedin: '', sessionPresenter: false, presentationTopic: '' });
      setSelectedSeat(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSeatGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
      <div className="grid grid-cols-8 gap-2 mb-4">
        {rows.map(row => 
          cols.map(col => {
            const seatId = `${row}${col}`;
            const isBooked = reservations.some(r => r.seatNumber === seatId);
            const isSelected = selectedSeat === seatId;

            let btnClass = "p-1 md:p-2 text-[10px] md:text-xs font-bold rounded aspect-square flex items-center justify-center transition ";
            
            if (isBooked) {
              btnClass += "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-500 cursor-not-allowed border-2 border-slate-300 dark:border-slate-700 opacity-60";
            } else if (isSelected) {
              btnClass += "bg-am-600 text-white shadow-lg shadow-am-500/30 border-2 border-am-600 scale-105";
            } else {
              btnClass += "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 cursor-pointer";
            }

            return (
              <button 
                key={seatId} 
                disabled={isBooked}
                onClick={() => handleSeatSelect(seatId)}
                className={btnClass}
                aria-label={`Seat ${seatId} ${isBooked ? 'Booked' : 'Available'}`}
              >
                {seatId}
              </button>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">ServiceNow Community Meetups</h1>

        {/* Present Event Section */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading meetups...</div>
        ) : presentMeetup ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-12 border border-slate-200 dark:border-slate-800 relative transition-colors duration-200">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-am-600 to-green-500"></div>
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-grow">
                  <div className="inline-flex items-center bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 animate-pulse">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span> Live Registration
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{presentMeetup.title}</h2>
                  <div className="flex flex-wrap gap-6 text-slate-600 dark:text-slate-300 mb-6">
                    <div className="flex items-center"><Calendar className="mr-2 text-am-500" size={20}/> {presentMeetup.date}</div>
                    <div className="flex items-center"><MapPin className="mr-2 text-am-500" size={20}/> {presentMeetup.location}</div>
                    <div className="flex items-center"><User className="mr-2 text-am-500" size={20}/> {presentMeetup.capacity} Seats Total</div>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">{presentMeetup.description}</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                  <button 
                    onClick={() => { setSelectedSeat(null); setShowRegModal(true); setSubmitSuccess(null); }}
                    className="bg-am-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-am-700 transition shadow-lg shadow-am-500/20"
                  >
                    Register Now
                  </button>
                  <button 
                    onClick={handleSeatModalOpen}
                    className="bg-white dark:bg-slate-800 border-2 border-am-600 text-am-600 dark:text-am-400 py-3 px-6 rounded-lg font-bold hover:bg-am-50 dark:hover:bg-slate-700 transition flex items-center justify-center"
                  >
                    <Armchair className="mr-2" size={20}/> Book Your Seat
                  </button>
                  <button 
                    onClick={() => setShowListModal(true)}
                    className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 text-sm py-2"
                  >
                    View Registered List ({reservations.filter(r => !r.isHidden).length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-8 rounded-xl border border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 mb-12">
            No ongoing meetups at the moment. Check back soon!
          </div>
        )}

        {/* Past and Future Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Past Events */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🏁</span> Past Events
            </h3>
            <div className="space-y-4">
              {meetups.filter(m => m.type === 'Past').map(m => (
                <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-80 hover:opacity-100 transition">
                  <h4 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{m.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{m.date} • {m.location}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Future Events */}
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 flex items-center">
               <span className="text-2xl mr-2">🔜</span> Future Events
            </h3>
            <div className="space-y-4">
              {meetups.filter(m => m.type === 'Future').map(m => (
                <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition border-l-4 border-l-am-500">
                  <h4 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{m.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{m.date} • {m.location}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{m.description}</p>
                  <button className="text-sm text-am-600 dark:text-am-400 font-semibold hover:underline">Notify Me</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Seat Booking Modal */}
      {showSeatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg relative border dark:border-slate-800 flex flex-col max-h-[90vh]">
            
             {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start shrink-0">
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Book Your Seat</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select a seat from the grid below.</p>
               </div>
               <button 
                  onClick={() => setShowSeatModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X size={24} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 md:p-6 overflow-y-auto">
              {seatLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-am-600 dark:text-am-400">
                  <Loader2 size={48} className="animate-spin mb-4" />
                  <p className="text-sm font-medium">Fetching available seats...</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2 px-1">
                     <span>Screen / Stage Area</span>
                     <span>{presentMeetup?.capacity ? presentMeetup.capacity - reservations.length : 0} seats left</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full mb-4 mx-auto"></div>
                  
                  {renderSeatGrid()}

                  <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded mr-1"></span> Available</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-am-600 rounded mr-1"></span> Selected</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded mr-1"></span> Booked</div>
                  </div>

                  <button 
                    onClick={confirmSeat}
                    disabled={!selectedSeat}
                    className="w-full bg-am-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-3 rounded-lg font-bold transition sticky bottom-0"
                  >
                    {selectedSeat ? `Confirm Seat ${selectedSeat}` : 'Select a Seat'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto border dark:border-slate-800">
             <button 
              onClick={() => { setShowRegModal(false); setSubmitSuccess(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration Successful!</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  You are booked for <span className="font-bold text-slate-900 dark:text-white">Seat {submitSuccess.seatNumber}</span>.
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mb-6">
                  <span className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">Your Swag</span>
                  <span className="text-xl font-bold text-am-600 dark:text-am-400">{submitSuccess.swag}</span>
                </div>
                <button 
                  onClick={() => { setShowRegModal(false); setSubmitSuccess(null); }}
                  className="block w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-lg font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Register for Meetup</h3>
                <form onSubmit={handleRegister} className="space-y-4">
                  {selectedSeat && (
                     <div className="bg-am-50 dark:bg-am-900/30 border border-am-200 dark:border-am-800 text-am-800 dark:text-am-300 px-4 py-3 rounded-lg flex items-center">
                        <Armchair className="mr-2" size={18} /> 
                        <span className="font-medium">Selected Seat: {selectedSeat}</span>
                     </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                    <input 
                      type="text" 
                      className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile URL *</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://linkedin.com/in/..."
                      className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                      value={formData.linkedin}
                      onChange={e => setFormData({...formData, linkedin: e.target.value})}
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-am-600 rounded focus:ring-am-500 border-gray-300 dark:border-slate-600 dark:bg-slate-800"
                        checked={formData.sessionPresenter}
                        onChange={e => setFormData({...formData, sessionPresenter: e.target.checked})}
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">I want to present a session</span>
                    </label>
                  </div>

                  {formData.sessionPresenter && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentation Topic</label>
                      <input 
                        type="text" 
                        required={formData.sessionPresenter}
                        className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none"
                        value={formData.presentationTopic}
                        onChange={e => setFormData({...formData, presentationTopic: e.target.value})}
                      />
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={submitLoading}
                    className="w-full bg-am-600 disabled:bg-am-400 text-white py-3 rounded-lg font-bold mt-4 flex justify-center items-center"
                  >
                    {submitLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                    {submitLoading ? 'Processing...' : 'Complete Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Registered List Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto border dark:border-slate-800">
             <button 
              onClick={() => setShowListModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Registered Attendees</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Seat</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Company</th>
                    <th className="p-4 font-bold">Swag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reservations
                    .filter(r => !r.isHidden)
                    .sort((a, b) => {
                      // Custom sort: Alphabetic first (A1), then numeric fallback
                      // Ensure strings are passed to localeCompare to avoid crash
                      return String(a.seatNumber || '').localeCompare(String(b.seatNumber || ''), undefined, { numeric: true, sensitivity: 'base' });
                    })
                    .map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <td className="p-4 font-bold text-am-600 dark:text-am-400">{r.seatNumber}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{r.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{r.sessionPresenter ? '🎤 Presenter' : 'Attendee'}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{r.company}</td>
                      <td className="p-4">
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                          {r.swag}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {reservations.filter(r => !r.isHidden).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">No registrations yet. Be the first!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Meetups;