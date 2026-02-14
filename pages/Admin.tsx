import React, { useState, useEffect, useMemo } from 'react';
import { checkAdmin, getMeetups, createMeetup, updateMeetup, deleteMeetup, getReservations, deleteReservation, updateReservation, registerUser, calculateSwag } from '../services/mockDb';
import { Meetup, Reservation, ReservationStatus } from '../types';
import { Shield, LayoutDashboard, Plus, Edit, Trash2, Users, Save, X, LogOut, Loader2, UserPlus, Eye, EyeOff, CheckCircle, XCircle, Calculator, CalendarClock, Lock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'meetups' | 'registrations'>('meetups');
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [selectedMeetupId, setSelectedMeetupId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Modals
  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [editingMeetup, setEditingMeetup] = useState<Meetup | null>(null);
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

  // --- NEW EDIT MODAL STATE ---
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editResForm, setEditResForm] = useState({
    seatNumber: '',
    status: 'pending' as ReservationStatus,
    rejectionReason: '',
    isHidden: false
  });
  
  // Form State for Meetup
  const [formData, setFormData] = useState<Partial<Meetup>>({
    title: '',
    date: '',
    location: '',
    description: '',
    type: 'Future',
    capacity: 64,
    registrationMode: 'registration',
    seatsPerTable: 8,
    reservedSeats: { hosts: 2, presenters: 2, volunteers: 2, sponsors: 0 },
    registrationStart: '',
    registrationEnd: '',
    isRegistrationClosed: false
  });

  // Form State for New Attendee
  const [attendeeData, setAttendeeData] = useState({
    name: '',
    email: '',
    company: '',
    linkedin: '',
    seatNumber: '',
    sessionPresenter: false,
    presentationTopic: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const success = await checkAdmin(username, password);
    setIsLoading(false);
    if (success) {
      setIsAuthenticated(true);
      refreshMeetups();
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const refreshMeetups = async () => {
    const data = await getMeetups();
    setMeetups(data);
  };

  const refreshReservations = async (meetupId: string) => {
    setIsLoading(true);
    const data = await getReservations(meetupId);
    setReservations(data);
    setIsLoading(false);
  };

  // --- Meetup CRUD ---

  const handleEditClick = (meetup: Meetup) => {
    setEditingMeetup(meetup);
    setFormData({
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
      description: meetup.description,
      type: meetup.type,
      capacity: meetup.capacity,
      registrationMode: meetup.registrationMode || 'registration',
      seatsPerTable: meetup.seatsPerTable || 8,
      reservedSeats: meetup.reservedSeats || { hosts: 2, presenters: 2, volunteers: 2, sponsors: 0 },
      registrationStart: meetup.registrationStart || '',
      registrationEnd: meetup.registrationEnd || '',
      isRegistrationClosed: meetup.isRegistrationClosed || false
    });
    setShowMeetupModal(true);
  };

  const handleCreateClick = () => {
    setEditingMeetup(null);
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      type: 'Future',
      capacity: 96,
      registrationMode: 'registration',
      seatsPerTable: 6,
      reservedSeats: { hosts: 2, presenters: 2, volunteers: 2, sponsors: 0 },
      registrationStart: '',
      registrationEnd: '',
      isRegistrationClosed: false
    });
    setShowMeetupModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meetup? This action cannot be undone and will delete all associated registrations.")) {
      return;
    }

    // Optimistic Update
    const prevMeetups = [...meetups];
    setMeetups(prev => prev.filter(m => m.id !== id));
    
    try {
      await deleteMeetup(id);
      // Don't need to refresh if success, state is already updated
      if (selectedMeetupId === id) {
        setSelectedMeetupId(null);
        setReservations([]);
      }
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert("Failed to delete meetup. It might have already been deleted.");
      setMeetups(prevMeetups); // Revert
      refreshMeetups();
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Type assertion for required fields
    const submissionData = formData as Omit<Meetup, 'id' | 'registrations'>;

    try {
      if (editingMeetup) {
        await updateMeetup(editingMeetup.id, submissionData);
      } else {
        await createMeetup(submissionData);
      }
      setShowMeetupModal(false);
      refreshMeetups();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculation Helper for Tables
  const totalTables = Math.ceil((formData.capacity || 0) / (formData.seatsPerTable || 8));

  // --- Registration CRUD ---
  const handleViewRegistrations = (id: string) => {
    setSelectedMeetupId(id);
    setActiveTab('registrations');
    refreshReservations(id);
  };

  // --- NEW: Single Edit Action Logic ---
  const handleEditReservationClick = (r: Reservation) => {
    setEditingReservation(r);
    setEditResForm({
      seatNumber: r.seatNumber || '',
      status: r.status,
      rejectionReason: r.rejectionReason || '',
      isHidden: !!r.isHidden
    });
  };

  const handleSaveReservation = async () => {
    if (!editingReservation) return;
    setIsLoading(true);
    try {
      // Recalculate swag if seat changes or status becomes confirmed
      const newSwag = (editResForm.seatNumber && editResForm.status === 'confirmed') 
        ? calculateSwag(editResForm.seatNumber) 
        : (editingReservation.swag || 'TBD');

      await updateReservation(editingReservation.id, {
        seatNumber: editResForm.seatNumber.toUpperCase(),
        status: editResForm.status,
        rejectionReason: editResForm.rejectionReason,
        isHidden: editResForm.isHidden,
        swag: newSwag
      });

      setEditingReservation(null);
      refreshReservations(editingReservation.meetupId);
    } catch (error: any) {
      alert("Failed to update: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReservationFromModal = async () => {
    if (!editingReservation) return;
    
    if (!window.confirm("Are you sure you want to permanently DELETE this registration? This cannot be undone.")) {
      return;
    }

    const idToDelete = editingReservation.id;
    const meetupId = editingReservation.meetupId;

    setIsLoading(true);
    
    // Optimistic Update: Close modal and remove from list immediately
    setEditingReservation(null);
    setReservations(prev => prev.filter(r => r.id !== idToDelete));

    try {
      await deleteReservation(idToDelete, meetupId);
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert("Failed to delete registration: " + error.message);
      refreshReservations(meetupId); // Revert/Refresh on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendeeClick = () => {
    setAttendeeData({ name: '', email: '', company: '', linkedin: '', seatNumber: '', sessionPresenter: false, presentationTopic: '' });
    setShowAddAttendeeModal(true);
  };

  const handleAddAttendeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeetupId) return;
    setIsLoading(true);
    try {
      const res = await registerUser({ meetupId: selectedMeetupId, ...attendeeData });
      await updateReservation(res.id, { status: 'confirmed' });
      setShowAddAttendeeModal(false);
      refreshReservations(selectedMeetupId);
    } catch (error: any) {
      alert("Error adding attendee: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe Sort
  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a,b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return String(a.seatNumber || '').localeCompare(String(b.seatNumber || ''), undefined, {numeric: true});
    });
  }, [reservations]);

  if (!isAuthenticated) {
    // ... Login UI (Keep existing)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-am-600 rounded-full flex items-center justify-center text-white mb-4">
              <Shield size={32} />
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Admin Console</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please sign in to manage meetups</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label className="sr-only">Username</label>
                <input type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder-slate-500 text-slate-900 rounded-t-md focus:outline-none focus:ring-am-500 focus:border-am-500 focus:z-10 sm:text-sm" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label className="sr-only">Password</label>
                <input type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder-slate-500 text-slate-900 rounded-b-md focus:outline-none focus:ring-am-500 focus:border-am-500 focus:z-10 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {authError && <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/30 dark:text-red-400 p-2 rounded">{authError}</div>}
            <div>
              <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-am-900 hover:bg-am-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-am-500 transition disabled:opacity-70">
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="bg-am-600 text-white p-2 rounded">
               <Shield size={20} />
             </div>
             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/setup" className="flex items-center text-sm text-am-600 dark:text-am-400 hover:text-am-800 dark:hover:text-am-300 font-medium">
              <UserPlus size={16} className="mr-2" /> Create New Admin
            </Link>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition font-medium">
              <LogOut size={16} className="mr-2" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm mb-8 w-fit">
          <button onClick={() => setActiveTab('meetups')} className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'meetups' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <LayoutDashboard size={16} className="mr-2" /> Manage Meetups
          </button>
          <button onClick={() => setActiveTab('registrations')} className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'registrations' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Users size={16} className="mr-2" /> Review Registrations
          </button>
        </div>

        {/* MEETUPS TAB */}
        {activeTab === 'meetups' && (
          <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">All Events</h2>
              <button onClick={handleCreateClick} className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center">
                <Plus size={16} className="mr-2" /> Create New Meetup
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Reg Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                  {meetups.map((meetup) => (
                    <tr key={meetup.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${meetup.type === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 
                            meetup.type === 'Past' ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'}`}>
                          {meetup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{meetup.title}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{meetup.date} • {meetup.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         {meetup.isRegistrationClosed ? (
                           <span className="text-red-600 dark:text-red-400 font-bold text-xs flex items-center"><Lock size={12} className="mr-1"/> Closed</span>
                         ) : (
                           <span className="text-green-600 dark:text-green-400 font-bold text-xs">Open</span>
                         )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col">
                           <span>Cap: {meetup.capacity} ({Math.ceil(meetup.capacity / (meetup.seatsPerTable || 8))} Tables)</span>
                           <span>Filled: {meetup.registrations}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleViewRegistrations(meetup.id)} className="text-am-600 dark:text-am-400 hover:text-am-900 dark:hover:text-am-300 mr-4" title="View Registrations"><Users size={18} /></button>
                        <button onClick={() => handleEditClick(meetup)} className="text-slate-600 dark:text-slate-400 hover:text-am-600 dark:hover:text-am-400 mr-4" title="Edit"><Edit size={18} /></button>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(meetup.id); }} 
                          className="text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400" 
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Meetup:</label>
                <select 
                  className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md p-2 text-sm focus:ring-am-500 focus:border-am-500"
                  value={selectedMeetupId || ''}
                  onChange={(e) => handleViewRegistrations(e.target.value)}
                >
                  <option value="">-- Select an event --</option>
                  {meetups.map(m => (
                    <option key={m.id} value={m.id}>{m.title} ({m.date})</option>
                  ))}
                </select>
              </div>

              {selectedMeetupId && (
                <button 
                  onClick={handleAddAttendeeClick}
                  className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center"
                >
                  <UserPlus size={16} className="mr-2" /> Add Attendee
                </button>
              )}
            </div>

            {selectedMeetupId && (
              <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Review Registrations ({reservations.length})
                    </h3>
                    <button 
                      className="text-sm text-am-600 dark:text-am-400 font-medium hover:underline"
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," 
                          + "Status,Seat,Name,Email,Company,LinkedIn,Presenter,Topic,Swag,Visible\n"
                          + reservations.map(r => `${r.status},${r.seatNumber},"${r.name}","${r.email}","${r.company}","${r.linkedin}",${r.sessionPresenter},"${r.presentationTopic || ''}","${r.swag}",${!r.isHidden}`).join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", `registrations_${selectedMeetupId}.csv`);
                        document.body.appendChild(link);
                        link.click();
                      }}
                    >
                      Export CSV
                    </button>
                 </div>
                 
                 <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="p-12 text-center text-slate-500">Loading data...</div>
                    ) : reservations.length > 0 ? (
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Seat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Swag</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                           {sortedReservations.map((r) => (
                            <tr key={r.id} className={r.isHidden ? 'bg-slate-100 dark:bg-slate-800 opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {r.status === 'confirmed' && <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-full font-bold border border-green-200 dark:border-green-800">Confirmed</span>}
                                {r.status === 'rejected' && <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs px-2 py-1 rounded-full font-bold border border-red-200 dark:border-red-800">Rejected</span>}
                                {r.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2 py-1 rounded-full font-bold border border-yellow-200 dark:border-yellow-800 animate-pulse">Pending</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-am-600 dark:text-am-400">
                                {r.status === 'confirmed' ? r.seatNumber : r.seatNumber ? <span className="text-slate-500 italic">Req: {r.seatNumber}</span> : <span className="text-slate-400 italic font-normal">TBD</span>}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center">{r.name} {r.isHidden && <span className="ml-2 text-xs text-slate-400">(Hidden)</span>} {r.sessionPresenter && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1 rounded">Speaker</span>}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{r.company}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex flex-col"><span>{r.email}</span><a href={r.linkedin} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs">LinkedIn</a></div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400"><span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs border border-slate-200 dark:border-slate-700">{r.status === 'confirmed' ? r.swag : 'TBD'}</span></td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditReservationClick(r)}
                                  className="text-slate-600 dark:text-slate-400 hover:text-am-600 dark:hover:text-am-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                                  title="Edit Registration"
                                >
                                  <Edit size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        No registrations found for this event.
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MEETUP MODAL */}
      {showMeetupModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto border dark:border-slate-800">
            <button 
              onClick={() => setShowMeetupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
              {editingMeetup ? 'Edit Meetup' : 'Create New Meetup'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1">Basic Details</h4>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                    <input type="date" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                        <option value="Future">Future</option>
                        <option value="Present">Present (Active)</option>
                        <option value="Past">Past</option>
                    </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea rows={2} required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              {/* Capacity & Tables Section */}
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center"><Calculator size={14} className="mr-1"/> Capacity & Layout</h4>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Capacity (People)</label>
                        <input type="number" required min="1" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seats Per Table</label>
                        <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.seatsPerTable} onChange={e => setFormData({...formData, seatsPerTable: parseInt(e.target.value)})}>
                            <option value="4">4 Seats</option>
                            <option value="6">6 Seats</option>
                            <option value="8">8 Seats</option>
                            <option value="10">10 Seats</option>
                        </select>
                    </div>
                 </div>
                 
                 <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md text-sm text-slate-600 dark:text-slate-400 flex justify-between items-center border border-slate-200 dark:border-slate-700">
                    <span>Tables Required:</span>
                    <span className="font-bold text-lg text-am-600 dark:text-am-400">{totalTables} Tables</span>
                 </div>

                 <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Reserved Seats (For Hosts, etc.)</label>
                    <div className="grid grid-cols-4 gap-2">
                        <div>
                             <label className="block text-xs mb-1">Hosts</label>
                             <input type="number" min="0" className="w-full text-sm border border-slate-300 rounded p-1" value={formData.reservedSeats?.hosts} onChange={e => setFormData({...formData, reservedSeats: {...formData.reservedSeats!, hosts: parseInt(e.target.value)}})} />
                        </div>
                        <div>
                             <label className="block text-xs mb-1">Presenters</label>
                             <input type="number" min="0" className="w-full text-sm border border-slate-300 rounded p-1" value={formData.reservedSeats?.presenters} onChange={e => setFormData({...formData, reservedSeats: {...formData.reservedSeats!, presenters: parseInt(e.target.value)}})} />
                        </div>
                        <div>
                             <label className="block text-xs mb-1">Volunteers</label>
                             <input type="number" min="0" className="w-full text-sm border border-slate-300 rounded p-1" value={formData.reservedSeats?.volunteers} onChange={e => setFormData({...formData, reservedSeats: {...formData.reservedSeats!, volunteers: parseInt(e.target.value)}})} />
                        </div>
                         <div>
                             <label className="block text-xs mb-1">Sponsors</label>
                             <input type="number" min="0" className="w-full text-sm border border-slate-300 rounded p-1" value={formData.reservedSeats?.sponsors} onChange={e => setFormData({...formData, reservedSeats: {...formData.reservedSeats!, sponsors: parseInt(e.target.value)}})} />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Registration Settings */}
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1 flex items-center"><CalendarClock size={14} className="mr-1"/> Registration Settings</h4>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Mode</label>
                    <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={formData.registrationMode} onChange={e => setFormData({...formData, registrationMode: e.target.value as any})}>
                        <option value="registration">Registration Only</option>
                        <option value="booking">Seat Booking Only</option>
                        <option value="both">Both Options</option>
                    </select>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Opens At</label>
                        <input type="datetime-local" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2 text-sm" value={formData.registrationStart} onChange={e => setFormData({...formData, registrationStart: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Closes At</label>
                        <input type="datetime-local" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2 text-sm" value={formData.registrationEnd} onChange={e => setFormData({...formData, registrationEnd: e.target.value})} />
                    </div>
                 </div>

                 <div className="flex items-center space-x-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="forceClose"
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500 border-gray-300"
                        checked={formData.isRegistrationClosed}
                        onChange={e => setFormData({...formData, isRegistrationClosed: e.target.checked})}
                    />
                    <label htmlFor="forceClose" className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center">
                        <Lock size={14} className="mr-1"/> Force Close Registrations (Manual Override)
                    </label>
                 </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setShowMeetupModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-am-900 border border-transparent rounded-md text-sm font-medium text-white hover:bg-am-800 flex items-center">
                   {isLoading ? <Loader2 size={16} className="animate-spin mr-2"/> : <Save size={16} className="mr-2"/>}
                   {editingMeetup ? 'Update Meetup' : 'Create Meetup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT REGISTRATION MODAL --- */}
      {editingReservation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative border dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setEditingReservation(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">
              Edit Registration
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Managing details for <span className="font-semibold text-am-600 dark:text-am-400">{editingReservation.name}</span>
            </p>

            <div className="space-y-5">
              
              {/* Status Section */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                   <select 
                      className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2 text-sm"
                      value={editResForm.status}
                      onChange={e => setEditResForm({...editResForm, status: e.target.value as ReservationStatus})}
                   >
                     <option value="pending">Pending</option>
                     <option value="confirmed">Confirmed</option>
                     <option value="rejected">Rejected</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Seat Number</label>
                   <input 
                     type="text" 
                     className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2 text-sm font-mono"
                     placeholder="TBD"
                     value={editResForm.seatNumber}
                     onChange={e => setEditResForm({...editResForm, seatNumber: e.target.value})}
                   />
                 </div>
              </div>

              {/* Conditional Rejection Reason */}
              {editResForm.status === 'rejected' && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-900">
                  <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">Rejection Reason</label>
                  <textarea 
                    rows={2}
                    className="w-full border border-red-300 dark:border-red-800 dark:bg-slate-900 rounded-md px-3 py-2 text-sm"
                    placeholder="Why is this being rejected?"
                    value={editResForm.rejectionReason}
                    onChange={e => setEditResForm({...editResForm, rejectionReason: e.target.value})}
                  />
                </div>
              )}

              {/* Visibility */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                  {editResForm.isHidden ? <EyeOff size={18} className="text-slate-500 mr-2"/> : <Eye size={18} className="text-blue-500 mr-2"/>}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hide from public lists</span>
                </div>
                <input 
                   type="checkbox"
                   className="w-5 h-5 text-am-600 rounded focus:ring-am-500"
                   checked={editResForm.isHidden}
                   onChange={e => setEditResForm({...editResForm, isHidden: e.target.checked})}
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 
                 {/* DELETE AREA */}
                 <button 
                   type="button"
                   onClick={handleDeleteReservationFromModal}
                   disabled={isLoading}
                   className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium flex items-center hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded transition"
                 >
                   <Trash2 size={16} className="mr-2" /> Delete Registration
                 </button>

                 <div className="flex space-x-3">
                   <button 
                     type="button"
                     onClick={() => setEditingReservation(null)}
                     disabled={isLoading}
                     className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-sm font-medium"
                   >
                     Cancel
                   </button>
                   <button 
                     type="button"
                     onClick={handleSaveReservation}
                     disabled={isLoading}
                     className="px-4 py-2 bg-am-600 text-white rounded-md text-sm font-bold hover:bg-am-700 shadow-md flex items-center"
                   >
                     <Save size={16} className="mr-2" /> Save Changes
                   </button>
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD ATTENDEE MODAL (Existing) */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-6 relative border dark:border-slate-800">
            {/* ... Modal Content same as before ... */}
             <button onClick={() => setShowAddAttendeeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Add Attendee</h3>
            <form onSubmit={handleAddAttendeeSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label><input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.name} onChange={e => setAttendeeData({...attendeeData, name: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label><input type="email" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.email} onChange={e => setAttendeeData({...attendeeData, email: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company *</label><input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.company} onChange={e => setAttendeeData({...attendeeData, company: e.target.value})} /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label><input type="text" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.linkedin} onChange={e => setAttendeeData({...attendeeData, linkedin: e.target.value})} placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seat Number</label><input type="text" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.seatNumber} onChange={e => setAttendeeData({...attendeeData, seatNumber: e.target.value})} placeholder="Optional" /></div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddAttendeeModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-am-600 text-white rounded-md text-sm font-medium hover:bg-am-700">{isLoading ? 'Adding...' : 'Add Attendee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Admin;