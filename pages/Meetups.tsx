import React, { useEffect, useState, useMemo } from 'react';
import { getMeetups, getReservations, registerUser } from '../services/mockDb';
import { Meetup, Reservation } from '../types';
import { Calendar, MapPin, User, Armchair, CheckCircle, Loader2, X, Users, BadgeCheck, Monitor, Clock, Lock } from 'lucide-react';

const Meetups: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [presentMeetup, setPresentMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showRegModal, setShowRegModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [listModalType, setListModalType] = useState<'all' | 'confirmed'>('all');
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
    // Only block if booked and NOT rejected
    if (reservations.some(r => r.seatNumber === seat && r.status !== 'rejected')) return;
    // Block reserved seats if needed (though they are disabled in UI)
    if (getReservedRole(seat)) return; 
    
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
        seatNumber: selectedSeat || '', // Send specific seat OR empty for TBD
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

  const openListModal = (type: 'all' | 'confirmed') => {
    setListModalType(type);
    setShowListModal(true);
  };

  // Helper to identify special seats based on dynamic config
  const reservedMap = useMemo(() => {
    if (!presentMeetup || !presentMeetup.reservedSeats) return {};
    
    const map: Record<string, { label: string, colorClass: string }> = {};
    const { hosts, presenters, volunteers, sponsors } = presentMeetup.reservedSeats;
    const seatsPerTable = presentMeetup.seatsPerTable || 8;
    
    let currentSeatIndex = 0;

    const assignSeats = (count: number, label: string, colorClass: string) => {
      for (let i = 0; i < count; i++) {
        const tableNum = Math.floor(currentSeatIndex / seatsPerTable) + 1;
        const seatNum = (currentSeatIndex % seatsPerTable) + 1;
        const seatId = `T${tableNum}-${seatNum}`;
        map[seatId] = { label, colorClass };
        currentSeatIndex++;
      }
    };

    assignSeats(hosts, 'Organizer', 'bg-purple-200 text-purple-800 border-purple-400 cursor-not-allowed');
    assignSeats(presenters, 'Presenter', 'bg-blue-200 text-blue-800 border-blue-400 cursor-not-allowed');
    assignSeats(volunteers, 'Volunteer', 'bg-orange-200 text-orange-800 border-orange-400 cursor-not-allowed');
    assignSeats(sponsors, 'Sponsor', 'bg-yellow-200 text-yellow-800 border-yellow-400 cursor-not-allowed');

    return map;
  }, [presentMeetup]);

  const getReservedRole = (seatId: string) => {
    return reservedMap[seatId];
  };

  // Check Registration Status
  const registrationStatus = useMemo(() => {
    if (!presentMeetup) return { status: 'closed', message: 'No active event' };
    
    if (presentMeetup.isRegistrationClosed) {
      return { status: 'closed', message: 'Registrations Closed' };
    }

    const now = new Date();
    
    if (presentMeetup.registrationStart) {
      const start = new Date(presentMeetup.registrationStart);
      if (now < start) return { status: 'upcoming', message: `Opens ${start.toLocaleString()}` };
    }

    if (presentMeetup.registrationEnd) {
      const end = new Date(presentMeetup.registrationEnd);
      if (now > end) return { status: 'closed', message: 'Registrations Ended' };
    }

    return { status: 'open', message: 'Registration Open' };
  }, [presentMeetup]);

  // Counts for Buttons
  const registeredCount = useMemo(() => reservations.filter(r => !r.isHidden).length, [reservations]);
  const confirmedCount = useMemo(() => reservations.filter(r => !r.isHidden && r.status === 'confirmed').length, [reservations]);

  const renderRoundTables = () => {
    if (!presentMeetup) return null;
    
    const seatsPerTable = presentMeetup.seatsPerTable || 8;
    const totalTables = Math.ceil(presentMeetup.capacity / seatsPerTable);
    const tables = Array.from({ length: totalTables }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24 p-8 justify-items-center mt-8">
        {tables.map(tableNum => (
          <div key={tableNum} className="relative w-40 h-40 flex items-center justify-center">
            {/* Table Surface */}
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-slate-300 dark:border-slate-600 shadow-md flex items-center justify-center z-10">
              <span className="text-lg font-bold text-slate-400 dark:text-slate-500">T{tableNum}</span>
            </div>

            {/* Seats */}
            {Array.from({ length: seatsPerTable }, (_, i) => {
              const seatNum = i + 1;
              const seatId = `T${tableNum}-${seatNum}`;
              const isBooked = reservations.some(r => r.seatNumber === seatId && r.status !== 'rejected');
              const isSelected = selectedSeat === seatId;
              const reservedRole = getReservedRole(seatId);

              // Positioning logic: Rotate around center
              const angle = (360 / seatsPerTable) * i; 
              const radius = 65; // Distance from center
              
              // Base Style
              let seatClass = "absolute w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition shadow-sm z-20 ";
              
              if (reservedRole) {
                seatClass += reservedRole.colorClass;
              } else if (isBooked) {
                seatClass += "bg-slate-800 text-white border-slate-900 cursor-not-allowed opacity-80 ";
              } else if (isSelected) {
                seatClass += "bg-am-600 text-white border-am-700 scale-110 shadow-md ring-2 ring-am-300 z-30 cursor-pointer ";
              } else {
                seatClass += "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-am-500 hover:text-am-600 cursor-pointer ";
              }

              return (
                <button
                  key={seatId}
                  onClick={() => !reservedRole && !isBooked && handleSeatSelect(seatId)}
                  disabled={!!reservedRole || isBooked}
                  className={seatClass}
                  style={{
                    transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
                  }}
                  title={reservedRole ? reservedRole.label : `Seat ${seatId}`}
                >
                  {seatNum}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Determine which buttons to show based on Meetup Config
  const showRegisterBtn = presentMeetup?.registrationMode === 'registration' || presentMeetup?.registrationMode === 'both' || !presentMeetup?.registrationMode;
  const showBookSeatBtn = presentMeetup?.registrationMode === 'booking' || presentMeetup?.registrationMode === 'both';
  const isRegOpen = registrationStatus.status === 'open';

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
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 ${isRegOpen ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                    {isRegOpen ? <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span> : <Lock size={12} className="mr-2"/>} 
                    {registrationStatus.message}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{presentMeetup.title}</h2>
                  <div className="flex flex-wrap gap-6 text-slate-600 dark:text-slate-300 mb-6">
                    <div className="flex items-center"><Calendar className="mr-2 text-am-500" size={20}/> {presentMeetup.date}</div>
                    <div className="flex items-center"><MapPin className="mr-2 text-am-500" size={20}/> {presentMeetup.location}</div>
                    <div className="flex items-center"><User className="mr-2 text-am-500" size={20}/> {presentMeetup.capacity} Seats Total</div>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">{presentMeetup.description}</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto min-w-[220px]">
                  
                  {isRegOpen ? (
                    <>
                      {showRegisterBtn && (
                        <button 
                          onClick={() => { setSelectedSeat(null); setShowRegModal(true); setSubmitSuccess(null); }}
                          className="bg-am-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-am-700 transition shadow-lg shadow-am-500/20"
                        >
                          Register Now
                        </button>
                      )}

                      {showBookSeatBtn && (
                        <button 
                          onClick={handleSeatModalOpen}
                          className="bg-white dark:bg-slate-800 border-2 border-am-600 text-am-600 dark:text-am-400 py-3 px-6 rounded-lg font-bold hover:bg-am-50 dark:hover:bg-slate-700 transition flex items-center justify-center"
                        >
                          <Armchair className="mr-2" size={20}/> Book Your Seat
                        </button>
                      )}
                    </>
                  ) : (
                    <button disabled className="bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-3 px-6 rounded-lg font-bold cursor-not-allowed border border-slate-300 dark:border-slate-700">
                      Registration Closed
                    </button>
                  )}
                  
                  <div className="pt-2 flex flex-col gap-2">
                    <button 
                      onClick={() => openListModal('all')}
                      className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 text-sm py-2 flex items-center justify-center border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Users size={16} className="mr-2" /> View Registered List ({registeredCount})
                    </button>
                    <button 
                      onClick={() => openListModal('confirmed')}
                      className="text-green-600 dark:text-green-400 font-bold hover:text-green-700 dark:hover:text-green-300 text-sm py-2 flex items-center justify-center border border-green-200 dark:border-green-800 rounded bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                    >
                      <BadgeCheck size={16} className="mr-2" /> View Confirmed List ({confirmedCount})
                    </button>
                  </div>
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl relative border dark:border-slate-800 flex flex-col max-h-[95vh]">
            
             {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start shrink-0 bg-white dark:bg-slate-900 rounded-t-2xl z-20">
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Book Your Seat</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select a seat. Specific roles are reserved.</p>
               </div>
               <button 
                  onClick={() => setShowSeatModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                  <X size={24} />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 md:p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 flex-grow">
              {seatLoading ? (
                <div className="h-64 flex flex-col items-center justify-center text-am-600 dark:text-am-400">
                  <Loader2 size={48} className="animate-spin mb-4" />
                  <p className="text-sm font-medium">Fetching available seats...</p>
                </div>
              ) : (
                <>
                  {/* Screen Representation */}
                  <div className="flex flex-col items-center mb-10">
                    <div className="w-2/3 h-2 bg-am-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)] mb-2"></div>
                    <div className="text-xs uppercase tracking-[0.3em] text-am-600 dark:text-am-400 font-bold flex items-center">
                      <Monitor size={14} className="mr-2" /> Presentation Screen
                    </div>
                  </div>
                  
                  {renderRoundTables()}

                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 my-8 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center"><span className="w-3 h-3 bg-white border border-slate-400 rounded mr-1"></span> Available</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-am-600 rounded mr-1"></span> Selected</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-slate-800 rounded mr-1"></span> Booked</div>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-2 hidden md:block"></div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-purple-200 border border-purple-400 rounded mr-1"></span> Organizer</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-blue-200 border border-blue-400 rounded mr-1"></span> Presenter</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-orange-200 border border-orange-400 rounded mr-1"></span> Volunteer</div>
                     <div className="flex items-center"><span className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded mr-1"></span> Sponsor</div>
                  </div>
                </>
              )}
            </div>

             {/* Footer - Fixed at bottom */}
             <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl shrink-0">
               <button 
                  onClick={confirmSeat}
                  disabled={!selectedSeat}
                  className="w-full bg-am-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-3 rounded-lg font-bold transition shadow-lg shadow-am-500/20"
                >
                  {selectedSeat ? `Confirm Seat ${selectedSeat}` : 'Select a Seat to Continue'}
                </button>
            </div>

          </div>
        </div>
      )}

      {/* Registration Modal (Keep Existing) */}
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
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Registration Submitted</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Your request is <strong>Pending Review</strong>.
                  <br/><span className="text-sm mt-2 block">We will verify your profile and confirm shortly.</span>
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mb-6">
                  <span className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">Status</span>
                  <span className="text-xl font-bold text-am-600 dark:text-am-400">Waiting for Confirmation</span>
                </div>
                
                {/* HIDE SEAT NUMBER UNTIL CONFIRMED */}
                {submitSuccess.status === 'confirmed' && submitSuccess.seatNumber ? (
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mb-6 ml-4">
                     <span className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">Seat</span>
                     <span className="text-xl font-bold text-am-600 dark:text-am-400">{submitSuccess.seatNumber}</span>
                   </div>
                ) : (
                   <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mb-6 ml-4">
                     <span className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold block mb-1">Seat</span>
                     <span className="text-lg font-medium text-slate-400 italic">Allocation Pending</span>
                   </div>
                )}

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
                  
                  {selectedSeat ? (
                     <div className="bg-am-50 dark:bg-am-900/30 border border-am-200 dark:border-am-800 text-am-800 dark:text-am-300 px-4 py-3 rounded-lg flex items-center">
                        <Armchair className="mr-2" size={18} /> 
                        <span className="font-medium">Requested Seat: {selectedSeat}</span>
                     </div>
                  ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-300 mb-4">
                       Seats will be assigned by the admin team upon confirmation.
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
                      <textarea 
                        required={formData.sessionPresenter}
                        rows={3}
                        className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-am-500 focus:outline-none resize-none"
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

      {/* Registered List Modal (Keep Existing) */}
      {showListModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto border dark:border-slate-800">
             <button 
              onClick={() => setShowListModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            <div className="flex items-center space-x-3 mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {listModalType === 'confirmed' ? 'Confirmed Attendees' : 'Registered Attendees'}
              </h3>
              {listModalType === 'confirmed' && <BadgeCheck className="text-green-500" size={28} />}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Seat</th>
                    <th className="p-4 font-bold">Name</th>
                    <th className="p-4 font-bold">Company</th>
                    <th className="p-4 font-bold">Swag</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reservations
                    .filter(r => !r.isHidden)
                    .filter(r => listModalType === 'confirmed' ? r.status === 'confirmed' : true)
                    .sort((a, b) => {
                      if (a.status !== 'confirmed') return 1;
                      if (b.status !== 'confirmed') return -1;
                      return String(a.seatNumber || '').localeCompare(String(b.seatNumber || ''), undefined, { numeric: true, sensitivity: 'base' });
                    })
                    .map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <td className="p-4 font-bold text-am-600 dark:text-am-400">
                        {r.status === 'confirmed' ? r.seatNumber : <span className="text-slate-400 text-xs font-normal italic">Pending</span>}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{r.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{r.sessionPresenter ? '🎤 Presenter' : 'Attendee'}</div>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{r.company}</td>
                      <td className="p-4">
                        <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium border border-slate-200 dark:border-slate-700">
                          {r.status === 'confirmed' ? r.swag : 'TBD'}
                        </span>
                      </td>
                      <td className="p-4">
                         {r.status === 'confirmed' ? (
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                              Confirmed
                           </span>
                         ) : r.status === 'rejected' ? (
                           <div className="flex flex-col items-start">
                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                                Rejected
                             </span>
                             {r.rejectionReason && (
                               <span className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[150px] leading-tight">
                                 {r.rejectionReason}
                               </span>
                             )}
                           </div>
                         ) : (
                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                              Pending
                           </span>
                         )}
                      </td>
                    </tr>
                  ))}
                  {reservations.filter(r => !r.isHidden).filter(r => listModalType === 'confirmed' ? r.status === 'confirmed' : true).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                        {listModalType === 'confirmed' 
                          ? 'No confirmed attendees yet. Check back soon!' 
                          : 'No registrations yet.'}
                      </td>
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