
import React, { useState, useEffect, useMemo } from 'react';
import { 
  checkAdmin, getMeetups, createMeetup, updateMeetup, deleteMeetup, 
  getReservations, deleteReservation, updateReservation, registerUser, calculateSwag,
  getLearningItems, createLearningItem, updateLearningItem, deleteLearningItem,
  getJobs, createJob, updateJob, deleteJob,
  getContactMessages, updateContactMessage,
  getInitiatives, createInitiative, updateInitiative, deleteInitiative,
  getProfile, updateProfile
} from '../services/mockDb';
import { Meetup, Reservation, ReservationStatus, LearningItem, LearningContentType, TARGET_AUDIENCES, Job, ContactMessage, Initiative, InitiativeCategory, UserProfile } from '../types';
import { Shield, LayoutDashboard, Plus, Edit, Trash2, Users, Save, X, LogOut, Loader2, UserPlus, Eye, EyeOff, BookOpen, Code2, MessageSquare, Briefcase, Mail, CheckCircle, FileText, Globe, HelpCircle, User, Layers, FolderOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'meetups' | 'registrations' | 'learning' | 'jobs' | 'messages' | 'content' | 'profile'>('meetups');
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [selectedMeetupId, setSelectedMeetupId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Learning Hub State
  const [learningItems, setLearningItems] = useState<LearningItem[]>([]);
  const [learningFilter, setLearningFilter] = useState('all');
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [editingLearningItem, setEditingLearningItem] = useState<LearningItem | null>(null);
  const [learningFormData, setLearningFormData] = useState<Partial<LearningItem>>({
    targetSlug: 'dev-fresher',
    type: 'path',
    moduleId: '',
    title: '',
    description: '',
    content: '',
    meta: ''
  });

  // Quiz Specific State
  const [quizOptions, setQuizOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);

  // Jobs State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobFormData, setJobFormData] = useState<Partial<Job>>({
    title: '', company: '', location: '', experience: '', description: '', postedDate: '', applyLink: ''
  });

  // Contact Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Initiatives (Site Content) State
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [contentFilter, setContentFilter] = useState<InitiativeCategory>('academy');
  const [showInitiativeModal, setShowInitiativeModal] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
  const [initiativeFormData, setInitiativeFormData] = useState<Partial<Initiative>>({
    title: '', description: '', category: 'academy', order: 0, iconName: ''
  });

  // Profile State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Practice specific fields helpers
  const [practiceMeta, setPracticeMeta] = useState({ regex: '', hint: '' });

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

  // --- Derived State Corrections ---
  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(i => i.category === contentFilter);
  }, [initiatives, contentFilter]);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  }, [reservations]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    const success = await checkAdmin(username, password);
    setIsLoading(false);
    if (success) {
      setIsAuthenticated(true);
      refreshAllData();
    } else {
      setAuthError('Invalid credentials');
    }
  };

  const refreshAllData = () => {
    refreshMeetups();
    refreshLearningItems();
    refreshJobs();
    refreshMessages();
    refreshInitiatives();
    refreshProfile();
  };

  const refreshMeetups = async () => { setMeetups(await getMeetups()); };
  const refreshReservations = async (meetupId: string) => { setIsLoading(true); setReservations(await getReservations(meetupId)); setIsLoading(false); };
  const refreshLearningItems = async () => { setLearningItems(await getLearningItems()); };
  const refreshJobs = async () => { setJobs(await getJobs()); };
  const refreshMessages = async () => { setMessages(await getContactMessages()); };
  const refreshInitiatives = async () => { setInitiatives(await getInitiatives()); };
  const refreshProfile = async () => { setProfile(await getProfile()); };

  // --- Profile CRUD ---
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSavingProfile(true);
    try {
        await updateProfile(profile);
        alert("Profile updated successfully!");
    } catch (e: any) {
        alert("Failed to update profile: " + e.message);
    } finally {
        setIsSavingProfile(false);
    }
  };

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    if (!profile) return;
    const newStats = [...profile.stats];
    newStats[index] = { ...newStats[index], [field]: val };
    setProfile({ ...profile, stats: newStats });
  };

  // --- Initiatives CRUD ---

  const handleCreateInitiative = () => {
    setEditingInitiative(null);
    setInitiativeFormData({
      title: '', description: '', category: contentFilter, order: 0, iconName: ''
    });
    setShowInitiativeModal(true);
  };

  const handleEditInitiative = (item: Initiative) => {
    setEditingInitiative(item);
    setInitiativeFormData({ ...item });
    setShowInitiativeModal(true);
  };

  const handleDeleteInitiative = async (id: string) => {
    if(confirm('Delete this content block?')) {
        try {
            await deleteInitiative(id);
            refreshInitiatives();
        } catch (e: any) {
            alert("Delete failed: " + e.message);
        }
    }
  };

  const handleInitiativeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = initiativeFormData as Omit<Initiative, 'id'>;
    try {
        if (editingInitiative) {
            await updateInitiative(editingInitiative.id, payload);
        } else {
            await createInitiative(payload);
        }
        setShowInitiativeModal(false);
        refreshInitiatives();
    } catch (e: any) {
        alert("Save failed: " + e.message);
    }
  };

  // --- Messages Actions ---
  const handleMarkMessageRead = async (id: string) => {
    try {
        await updateContactMessage(id, { read: true });
        refreshMessages();
    } catch (e) {
        console.error("Failed to mark read", e);
    }
  };

  // --- Jobs CRUD ---

  const handleCreateJob = () => {
    setEditingJob(null);
    setJobFormData({
        title: '', company: '', location: '', experience: '', description: '', 
        postedDate: new Date().toISOString().split('T')[0], applyLink: ''
    });
    setShowJobModal(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setJobFormData({ ...job });
    setShowJobModal(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (editingJob) {
            await updateJob(editingJob.id, jobFormData);
        } else {
            await createJob(jobFormData as Omit<Job, 'id'>);
        }
        setShowJobModal(false);
        refreshJobs();
    } catch (e: any) {
        alert("Job save failed: " + e.message);
    }
  }

  const handleDeleteJob = async (id: string) => {
    if(confirm('Delete this job?')) {
        try {
            await deleteJob(id);
            refreshJobs();
        } catch (e: any) {
            alert("Job delete failed: " + e.message);
        }
    }
  }

  // --- Learning Hub CRUD ---

  const availableModules = useMemo(() => {
    const slug = learningFormData.targetSlug;
    return learningItems.filter(item => item.targetSlug === slug && item.type === 'path');
  }, [learningItems, learningFormData.targetSlug]);

  const handleCreateLearning = (preselectedModuleId: string = '') => {
    setEditingLearningItem(null);
    setLearningFormData({
      targetSlug: learningFilter !== 'all' ? learningFilter : 'dev-fresher',
      type: preselectedModuleId ? 'quiz' : 'path',
      moduleId: preselectedModuleId,
      title: '',
      description: '',
      content: '',
      meta: ''
    });
    setPracticeMeta({ regex: '', hint: '' });
    setQuizOptions(['', '', '', '']);
    setCorrectOptionIndex(0);
    setShowLearningModal(true);
  };

  const handleEditLearning = (item: LearningItem) => {
    setEditingLearningItem(item);
    setLearningFormData({ ...item });
    
    // Reset specific states
    setPracticeMeta({ regex: '', hint: '' });
    setQuizOptions(['', '', '', '']);
    setCorrectOptionIndex(0);

    if (item.type === 'practice' && item.meta) {
        try {
            const metaObj = JSON.parse(item.meta);
            setPracticeMeta({ regex: metaObj.regex || '', hint: metaObj.hint || '' });
        } catch {
            setPracticeMeta({ regex: '', hint: '' });
        }
    } else if (item.type === 'quiz') {
        try {
            setQuizOptions(JSON.parse(item.content || '["","","",""]'));
            const meta = JSON.parse(item.meta || '{}');
            setCorrectOptionIndex(meta.correctIndex || 0);
        } catch {
            // fallback
        }
    }
    setShowLearningModal(true);
  };

  const handleDeleteLearning = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
        try {
            await deleteLearningItem(id);
            refreshLearningItems();
        } catch (e: any) {
            alert("Delete failed: " + e.message);
        }
    }
  };

  const handleLearningSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let submissionMeta = learningFormData.meta || '';
    let submissionContent = learningFormData.content || '';

    if (learningFormData.type === 'practice') {
        submissionMeta = JSON.stringify(practiceMeta);
    } else if (learningFormData.type === 'quiz') {
        submissionContent = JSON.stringify(quizOptions);
        submissionMeta = JSON.stringify({ correctIndex: correctOptionIndex });
    }

    const payload = { ...learningFormData, content: submissionContent, meta: submissionMeta } as Omit<LearningItem, 'id'>;

    try {
        if (editingLearningItem) {
            await updateLearningItem(editingLearningItem.id, payload);
        } else {
            await createLearningItem(payload);
        }
        setShowLearningModal(false);
        refreshLearningItems();
    } catch (e: any) {
        alert("Failed to save learning item: " + e.message);
    }
  };

  // Learning Render Helpers
  const renderLearningHierarchy = () => {
    if (learningFilter === 'all') return <div className="text-center p-8 text-slate-500">Please select a Target Audience to view modules and content.</div>;

    const filtered = learningItems.filter(i => i.targetSlug === learningFilter);
    const modules = filtered.filter(i => i.type === 'path').sort((a,b) => (a.order || 0) - (b.order || 0));
    const orphans = filtered.filter(i => i.type !== 'path' && !i.moduleId);

    return (
        <div className="space-y-8">
            {/* Modules Loop */}
            {modules.map(module => {
                const children = filtered.filter(i => i.moduleId === module.id).sort((a,b) => (a.order || 0) - (b.order || 0));
                
                return (
                    <div key={module.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        {/* Module Header */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-am-100 dark:bg-am-900/30 text-am-600 dark:text-am-400 flex items-center justify-center font-bold text-sm">{module.order}</span>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{module.title}</h3>
                                    <p className="text-xs text-slate-500">{module.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleCreateLearning(module.id)} className="text-xs bg-am-600 text-white px-3 py-1.5 rounded hover:bg-am-700 flex items-center font-bold transition">
                                    <Plus size={14} className="mr-1"/> Add Quiz
                                </button>
                                <button onClick={() => handleEditLearning(module)} className="p-2 text-slate-500 hover:text-am-600"><Edit size={16}/></button>
                                <button onClick={() => handleDeleteLearning(module.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 size={16}/></button>
                            </div>
                        </div>

                        {/* Module Content (Children) */}
                        {children.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {children.map(child => (
                                    <div key={child.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded ${
                                                child.type === 'quiz' ? 'bg-orange-100 text-orange-600' :
                                                child.type === 'practice' ? 'bg-green-100 text-green-600' : 
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                                {child.type === 'quiz' ? <HelpCircle size={16} /> : child.type === 'practice' ? <Code2 size={16}/> : <FileText size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm text-slate-800 dark:text-slate-200">{child.title}</div>
                                                <div className="text-xs text-slate-500 line-clamp-1">{child.description}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditLearning(child)} className="text-slate-400 hover:text-am-600"><Edit size={14}/></button>
                                            <button onClick={() => handleDeleteLearning(child.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400 italic">No quizzes or content added to this module yet.</div>
                        )}
                    </div>
                );
            })}

            {/* Orphans Section */}
            {orphans.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                        <FolderOpen size={18} className="mr-2"/> General / Uncategorized Content
                    </h3>
                    <div className="grid gap-3">
                        {orphans.map(item => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                                        item.type === 'practice' ? 'bg-green-100 text-green-700' : 
                                        item.type === 'interview' ? 'bg-purple-100 text-purple-700' : 
                                        item.type === 'quiz' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {item.type}
                                    </span>
                                    <span className="font-medium text-sm text-slate-800 dark:text-white">{item.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditLearning(item)} className="text-slate-400 hover:text-am-600"><Edit size={14}/></button>
                                    <button onClick={() => handleDeleteLearning(item.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {modules.length === 0 && orphans.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    <p>No content found for this category.</p>
                    <button onClick={() => handleCreateLearning()} className="mt-4 text-am-600 font-bold hover:underline">Create First Module</button>
                </div>
            )}
        </div>
    );
  };

  // ... (Keep existing Meetup CRUD methods) ...
  const handleEditClick = (meetup: Meetup) => {
    setEditingMeetup(meetup);
    setFormData({ ...meetup } as any);
    setShowMeetupModal(true);
  };

  const handleCreateClick = () => {
    setEditingMeetup(null);
    setFormData({
      title: '', date: '', location: '', description: '', type: 'Future', capacity: 96,
      registrationMode: 'registration', seatsPerTable: 6,
      reservedSeats: { hosts: 2, presenters: 2, volunteers: 2, sponsors: 0 },
      registrationStart: '', registrationEnd: '', isRegistrationClosed: false
    });
    setShowMeetupModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this meetup?")) return;
    try { await deleteMeetup(id); refreshMeetups(); } catch (error: any) { alert("Failed to delete meetup."); }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const submissionData = formData as Omit<Meetup, 'id' | 'registrations'>;
    try {
      if (editingMeetup) { await updateMeetup(editingMeetup.id, submissionData); } 
      else { await createMeetup(submissionData); }
      setShowMeetupModal(false);
      refreshMeetups();
    } catch (error: any) { alert("Error: " + error.message); } 
    finally { setIsLoading(false); }
  };

  const handleViewRegistrations = (id: string) => { setSelectedMeetupId(id); setActiveTab('registrations'); refreshReservations(id); };
  const handleEditReservationClick = (r: Reservation) => { setEditingReservation(r); setEditResForm({ seatNumber: r.seatNumber || '', status: r.status, rejectionReason: r.rejectionReason || '', isHidden: !!r.isHidden }); };
  const handleSaveReservation = async () => { if (!editingReservation) return; setIsLoading(true); try { const newSwag = (editResForm.seatNumber && editResForm.status === 'confirmed') ? calculateSwag(editResForm.seatNumber) : (editingReservation.swag || 'TBD'); await updateReservation(editingReservation.id, { seatNumber: editResForm.seatNumber.toUpperCase(), status: editResForm.status, rejectionReason: editResForm.rejectionReason, isHidden: editResForm.isHidden, swag: newSwag }); setEditingReservation(null); refreshReservations(editingReservation.meetupId); } catch (error: any) { alert("Failed to update: " + error.message); } finally { setIsLoading(false); } };
  const handleDeleteReservationFromModal = async () => { if (!editingReservation) return; if (!window.confirm("Permanently DELETE this registration?")) return; const idToDelete = editingReservation.id; const meetupId = editingReservation.meetupId; setIsLoading(true); setEditingReservation(null); try { await deleteReservation(idToDelete, meetupId); refreshReservations(meetupId); } catch (error: any) { alert("Failed to delete: " + error.message); } finally { setIsLoading(false); } };

  // --- NEW: Add Attendee (Admin Override) ---
  const handleAddAttendeeClick = () => {
    if (!selectedMeetupId) return;
    setAttendeeData({ name: '', email: '', company: '', linkedin: '', seatNumber: '', sessionPresenter: false, presentationTopic: '' });
    setShowAddAttendeeModal(true);
  };

  const handleAttendeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeetupId) return;
    
    try {
        await registerUser({
            meetupId: selectedMeetupId,
            ...attendeeData
        });
        alert('Attendee registered successfully!');
        setShowAddAttendeeModal(false);
        refreshReservations(selectedMeetupId);
    } catch (error: any) {
        alert('Registration failed: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-10 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-am-600 rounded-full flex items-center justify-center text-white mb-4">
              <Shield size={32} />
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Admin Console</h2>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div><input type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-t-md" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
                <div><input type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-b-md" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              </div>
              {authError && <div className="text-red-500 text-sm text-center">{authError}</div>}
              <div><button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-am-900 hover:bg-am-800">{isLoading ? <Loader2 className="animate-spin" /> : 'Sign in'}</button></div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-900 shadow border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <div className="bg-am-600 text-white p-2 rounded"><Shield size={20} /></div>
             <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/admin/setup" className="flex items-center text-sm text-am-600 dark:text-am-400 hover:text-am-800 font-medium"><UserPlus size={16} className="mr-2" /> Create New Admin</Link>
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 font-medium"><LogOut size={16} className="mr-2" /> Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm mb-8 w-fit">
          <button onClick={() => setActiveTab('meetups')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'meetups' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><LayoutDashboard size={16} className="mr-2" /> Meetups</button>
          <button onClick={() => setActiveTab('registrations')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'registrations' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><Users size={16} className="mr-2" /> Registrations</button>
          <button onClick={() => setActiveTab('messages')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'messages' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><Mail size={16} className="mr-2" /> Messages</button>
          <button onClick={() => setActiveTab('content')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'content' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><Globe size={16} className="mr-2" /> Site Content</button>
          <button onClick={() => setActiveTab('learning')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'learning' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><BookOpen size={16} className="mr-2" /> Learning</button>
          <button onClick={() => setActiveTab('jobs')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'jobs' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><Briefcase size={16} className="mr-2" /> Jobs</button>
          <button onClick={() => setActiveTab('profile')} className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center ${activeTab === 'profile' ? 'bg-am-100 dark:bg-am-900/50 text-am-700 dark:text-am-300' : 'text-slate-600 dark:text-slate-400'}`}><User size={16} className="mr-2" /> Profile</button>
        </div>

        {/* ... (Existing Tabs: Messages, Content, Jobs, Profile, Meetups, Registrations) ... */}
        {/* Profile, Messages, Content, Jobs code remains identical as before */}
        
        {activeTab === 'profile' && profile && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Edit User Profile</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Headline</label>
                        <input 
                            type="text" 
                            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                            value={profile.headline}
                            onChange={e => setProfile({...profile, headline: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio (Short Intro)</label>
                        <textarea 
                            rows={4} 
                            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                            value={profile.bio}
                            onChange={e => setProfile({...profile, bio: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Journey / History</label>
                        <textarea 
                            rows={6} 
                            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                            value={profile.journey || ''}
                            onChange={e => setProfile({...profile, journey: e.target.value})}
                            placeholder="Share your professional journey, milestones, and timeline..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Future Goals & Initiatives</label>
                        <textarea 
                            rows={4} 
                            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                            value={profile.futureGoals || ''}
                            onChange={e => setProfile({...profile, futureGoals: e.target.value})}
                            placeholder="What are you building next?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Certifications & Achievements</label>
                        <textarea 
                            rows={4} 
                            className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                            value={profile.certifications || ''}
                            onChange={e => setProfile({...profile, certifications: e.target.value})}
                            placeholder="List your certifications (one per line)..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn Badge HTML Code</label>
                        <textarea 
                            rows={3} 
                            className="w-full font-mono text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-md px-3 py-2"
                            value={profile.linkedinBadgeHtml}
                            onChange={e => setProfile({...profile, linkedinBadgeHtml: e.target.value})}
                            placeholder="<div class='badge-base LI-profile-badge'...>"
                        />
                        <p className="text-xs text-slate-500 mt-1">Paste the full embed code provided by LinkedIn.</p>
                    </div>
                    
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Key Statistics</label>
                        <div className="grid grid-cols-3 gap-4">
                            {profile.stats.map((stat, idx) => (
                                <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                    <input 
                                        type="text" 
                                        className="w-full text-center font-bold mb-1 border-b border-transparent hover:border-slate-300 bg-transparent focus:outline-none dark:text-white"
                                        value={stat.value}
                                        onChange={e => updateStat(idx, 'value', e.target.value)}
                                        placeholder="Value"
                                    />
                                    <input 
                                        type="text" 
                                        className="w-full text-center text-xs uppercase text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:outline-none"
                                        value={stat.label}
                                        onChange={e => updateStat(idx, 'label', e.target.value)}
                                        placeholder="Label"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={isSavingProfile} className="bg-am-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-am-700 flex items-center">
                            {isSavingProfile ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
           <div className="space-y-6">
             <h2 className="text-xl font-bold text-slate-800 dark:text-white">Contact Submissions</h2>
             <div className="grid gap-4">
               {messages.map(msg => (
                 <div key={msg.id} className={`bg-white dark:bg-slate-900 p-6 rounded-xl border ${msg.read ? 'border-slate-200 dark:border-slate-800' : 'border-am-500 shadow-md'} relative`}>
                   {!msg.read && <div className="absolute top-4 right-4 bg-am-600 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">New</div>}
                   <div className="flex flex-col md:flex-row justify-between mb-4">
                     <div>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white">{msg.name}</h3>
                       <div className="text-sm text-slate-500">{msg.email} • {msg.phone}</div>
                       <div className="text-xs text-slate-400 mt-1">{new Date(msg.submittedAt).toLocaleString()}</div>
                     </div>
                     {!msg.read && (
                       <button onClick={() => handleMarkMessageRead(msg.id)} className="mt-2 md:mt-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center h-fit">
                         <CheckCircle size={14} className="mr-1"/> Mark Read
                       </button>
                     )}
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap">
                     {msg.message}
                   </div>
                 </div>
               ))}
               {messages.length === 0 && <div className="text-center p-8 text-slate-500">No messages yet.</div>}
             </div>
           </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
           <div className="space-y-6">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Page Category:</label>
                    <select className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md p-2 text-sm" value={contentFilter} onChange={(e) => setContentFilter(e.target.value as InitiativeCategory)}>
                        <option value="academy">AM Academy</option>
                        <option value="marketing">AM Marketing</option>
                        <option value="foods">AM Foods</option>
                        <option value="tech">AM Tech</option>
                    </select>
                </div>
                <button onClick={handleCreateInitiative} className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center"><Plus size={16} className="mr-2" /> Add Content Block</button>
             </div>
             
             <div className="grid gap-4">
                {filteredInitiatives.map(item => (
                   <div key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-start">
                      <div className="flex-grow pr-4">
                         <div className="flex items-center gap-2 mb-2">
                             <span className="text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">Order: {item.order}</span>
                             {item.iconName && <span className="text-xs font-mono bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded flex items-center"><Code2 size={10} className="mr-1"/> {item.iconName}</span>}
                         </div>
                         <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                         <button onClick={() => handleEditInitiative(item)} className="p-2 text-slate-500 hover:text-am-600"><Edit size={16}/></button>
                         <button onClick={() => handleDeleteInitiative(item.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 size={16}/></button>
                      </div>
                   </div>
                ))}
             </div>
           </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
             <div className="space-y-6">
                 {/* ... Job UI ... */}
                 <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Posted Jobs</h2>
                    <button onClick={handleCreateJob} className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center"><Plus size={16} className="mr-2" /> Post New Job</button>
                 </div>
                 
                 <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Position</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company & Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white">{job.title}</div>
                                        <div className="text-xs text-slate-500">Posted: {job.postedDate}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{job.company}</div>
                                        <div className="text-sm text-slate-500">{job.location}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {job.experience}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button onClick={() => handleEditJob(job)} className="text-slate-600 hover:text-am-600 mr-4"><Edit size={16} /></button>
                                        <button onClick={() => handleDeleteJob(job.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
             </div>
        )}

        {/* LEARNING TAB */}
        {activeTab === 'learning' && (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Audience:</label>
                        <select className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md p-2 text-sm" value={learningFilter} onChange={(e) => setLearningFilter(e.target.value)}>
                            <option value="all">All Audiences</option>
                            {TARGET_AUDIENCES.map(t => <option key={t.slug} value={t.slug}>{t.label}</option>)}
                        </select>
                    </div>
                    <button onClick={() => handleCreateLearning()} className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center"><Plus size={16} className="mr-2" /> Add Path/Module</button>
                </div>

                {renderLearningHierarchy()}
            </div>
        )}

        {/* Meetups & Registrations Tabs (identical to before) */}
        {activeTab === 'meetups' && (
          <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">All Events</h2>
              <button onClick={handleCreateClick} className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center">
                <Plus size={16} className="mr-2" /> Create New Meetup
              </button>
            </div>
             <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Stats</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                  {meetups.map((meetup) => (
                    <tr key={meetup.id}>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{meetup.type}</span></td>
                      <td className="px-6 py-4"><div className="text-sm font-medium text-slate-900 dark:text-white">{meetup.title}</div><div className="text-sm text-slate-500">{meetup.date}</div></td>
                      <td className="px-6 py-4 text-sm text-slate-500">Filled: {meetup.registrations}/{meetup.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleViewRegistrations(meetup.id)} className="text-am-600 mr-4"><Users size={18} /></button>
                        <button onClick={() => handleEditClick(meetup)} className="text-slate-600 mr-4"><Edit size={18} /></button>
                        <button onClick={() => handleDeleteClick(meetup.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}

        {activeTab === 'registrations' && (
           <div className="space-y-6">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Meetup:</label>
                <select className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md p-2 text-sm" value={selectedMeetupId || ''} onChange={(e) => handleViewRegistrations(e.target.value)}>
                  <option value="">-- Select an event --</option>
                  {meetups.map(m => <option key={m.id} value={m.id}>{m.title} ({m.date})</option>)}
                </select>
              </div>
              
              {/* Add Attendee Button */}
              {selectedMeetupId && (
                  <button 
                    onClick={handleAddAttendeeClick}
                    className="bg-am-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-am-700 transition flex items-center"
                  >
                    <Plus size={16} className="mr-2"/> Add Attendee
                  </button>
              )}
            </div>
            {selectedMeetupId && (
                <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendee</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                           {sortedReservations.map((r) => (
                            <tr key={r.id}>
                              <td className="px-6 py-4">{r.status}</td>
                              <td className="px-6 py-4"><div>{r.name}</div><div className="text-xs text-slate-500">{r.email}</div></td>
                              <td className="px-6 py-4 text-right"><button onClick={() => handleEditReservationClick(r)} className="text-slate-600"><Edit size={16} /></button></td>
                            </tr>
                           ))}
                        </tbody>
                      </table>
                    </div>
                </div>
            )}
           </div>
        )}

      </div>

      {/* --- MODALS SECTION --- */}

      {/* LEARNING MODAL */}
      {showLearningModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto border dark:border-slate-800">
                <button onClick={() => setShowLearningModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24} /></button>
                <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">{editingLearningItem ? 'Edit Content' : 'Add New Content'}</h3>
                
                <form onSubmit={handleLearningSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                            <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.targetSlug} onChange={e => setLearningFormData({...learningFormData, targetSlug: e.target.value, moduleId: ''})}>
                                {TARGET_AUDIENCES.map(t => <option key={t.slug} value={t.slug}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content Type</label>
                            <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.type} onChange={e => setLearningFormData({...learningFormData, type: e.target.value as LearningContentType})}>
                                <option value="path">Module (Path)</option>
                                <option value="interview">Interview Question</option>
                                <option value="practice">Practice Challenge</option>
                                <option value="quiz">Quiz Question</option>
                                <option value="project">Real Project</option>
                            </select>
                        </div>
                    </div>

                    {learningFormData.type !== 'path' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Parent Module (Optional)</label>
                            <select 
                                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" 
                                value={learningFormData.moduleId || ''} 
                                onChange={e => setLearningFormData({...learningFormData, moduleId: e.target.value})}
                            >
                                <option value="">-- No Specific Module --</option>
                                {availableModules.map(mod => (
                                    <option key={mod.id} value={mod.id}>{mod.title}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">Associate this question/content with a specific module in this path.</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title / Question</label>
                        <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.title} onChange={e => setLearningFormData({...learningFormData, title: e.target.value})} />
                    </div>

                    {learningFormData.type === 'quiz' ? (
                        <>
                            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <label className="block text-sm font-bold text-slate-700 dark:text-white flex items-center"><HelpCircle size={16} className="mr-2"/> Quiz Options</label>
                                {quizOptions.map((opt, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name="correctOption" 
                                            checked={correctOptionIndex === idx} 
                                            onChange={() => setCorrectOptionIndex(idx)}
                                            className="w-4 h-4 text-am-600"
                                        />
                                        <input 
                                            type="text" 
                                            placeholder={`Option ${idx + 1}`}
                                            required
                                            className="flex-grow border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded px-3 py-2 text-sm"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...quizOptions];
                                                newOpts[idx] = e.target.value;
                                                setQuizOptions(newOpts);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Explanation (Shown after answering)</label>
                                <textarea rows={2} required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.description} onChange={e => setLearningFormData({...learningFormData, description: e.target.value})} />
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description / Short Answer</label>
                            <textarea rows={2} required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.description} onChange={e => setLearningFormData({...learningFormData, description: e.target.value})} />
                        </div>
                    )}

                    {learningFormData.type === 'practice' && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
                            <h4 className="font-bold text-sm text-am-600 flex items-center"><Code2 size={14} className="mr-2"/> Coding Challenge Details</h4>
                            <div>
                                <label className="block text-xs font-bold uppercase mb-1">Initial Code Block</label>
                                <textarea rows={4} className="w-full font-mono text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-md px-3 py-2" value={learningFormData.content} onChange={e => setLearningFormData({...learningFormData, content: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Solution Regex</label>
                                    <input type="text" className="w-full font-mono text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-md px-3 py-2" value={practiceMeta.regex} onChange={e => setPracticeMeta({...practiceMeta, regex: e.target.value})} placeholder="e.g. gr\.query\(\)" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase mb-1">Hint Text</label>
                                    <input type="text" className="w-full text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-md px-3 py-2" value={practiceMeta.hint} onChange={e => setPracticeMeta({...practiceMeta, hint: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    )}

                    {learningFormData.type === 'interview' && (
                         <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Answer</label>
                            <textarea rows={4} className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={learningFormData.content} onChange={e => setLearningFormData({...learningFormData, content: e.target.value})} />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowLearningModal(false)} className="px-4 py-2 border border-slate-300 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-am-600 text-white rounded-md text-sm font-bold hover:bg-am-700">Save Content</button>
                    </div>
                </form>
             </div>
        </div>
      )}

      {/* INITIATIVE MODAL (Site Content) */}
      {showInitiativeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-6 border dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingInitiative ? 'Edit Content Block' : 'Add Content Block'}</h3>
                    <button onClick={() => setShowInitiativeModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleInitiativeSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                        <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={initiativeFormData.title} onChange={e => setInitiativeFormData({...initiativeFormData, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                        <textarea rows={3} required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={initiativeFormData.description} onChange={e => setInitiativeFormData({...initiativeFormData, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon Name (Lucide)</label>
                            <input type="text" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={initiativeFormData.iconName} onChange={e => setInitiativeFormData({...initiativeFormData, iconName: e.target.value})} placeholder="e.g. 'Award'" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order</label>
                            <input type="number" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={initiativeFormData.order} onChange={e => setInitiativeFormData({...initiativeFormData, order: parseInt(e.target.value) || 0})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={initiativeFormData.category} onChange={e => setInitiativeFormData({...initiativeFormData, category: e.target.value as InitiativeCategory})}>
                            <option value="academy">AM Academy</option>
                            <option value="marketing">AM Marketing</option>
                            <option value="foods">AM Foods</option>
                            <option value="tech">AM Tech</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowInitiativeModal(false)} className="px-4 py-2 border border-slate-300 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-am-600 text-white rounded-md text-sm font-bold hover:bg-am-700">Save Block</button>
                    </div>
                </form>
             </div>
        </div>
      )}

      {/* ADD ATTENDEE MODAL */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg p-6 border dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Manually Register Attendee</h3>
                    <button onClick={() => setShowAddAttendeeModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleAttendeeSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                        <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.name} onChange={e => setAttendeeData({...attendeeData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                        <input type="email" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.email} onChange={e => setAttendeeData({...attendeeData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                        <input type="text" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.company} onChange={e => setAttendeeData({...attendeeData, company: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn URL</label>
                        <input type="text" required className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" value={attendeeData.linkedin} onChange={e => setAttendeeData({...attendeeData, linkedin: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Seat (Optional)</label>
                        <input type="text" className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2" placeholder="e.g. T1-1" value={attendeeData.seatNumber} onChange={e => setAttendeeData({...attendeeData, seatNumber: e.target.value})} />
                        <p className="text-xs text-slate-500 mt-1">Leave blank for Pending/TBD allocation.</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="presenter" checked={attendeeData.sessionPresenter} onChange={e => setAttendeeData({...attendeeData, sessionPresenter: e.target.checked})} className="rounded text-am-600 focus:ring-am-500"/>
                        <label htmlFor="presenter" className="text-sm font-medium text-slate-700 dark:text-slate-300">Is Presenter?</label>
                    </div>

                    {attendeeData.sessionPresenter && (
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Presentation Topic</label>
                            <textarea
                                required
                                rows={3}
                                className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md px-3 py-2"
                                value={attendeeData.presentationTopic}
                                onChange={e => setAttendeeData({...attendeeData, presentationTopic: e.target.value})}
                                placeholder="Title or brief description of the talk..."
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setShowAddAttendeeModal(false)} className="px-4 py-2 border border-slate-300 rounded-md text-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-am-600 text-white rounded-md text-sm font-bold hover:bg-am-700">Add Attendee</button>
                    </div>
                </form>
             </div>
        </div>
      )}

      {/* ... (Other existing modals) ... */}
    </div>
  );
};

export default Admin;
