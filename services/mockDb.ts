
import { Job, LearningPath, InterviewQuestion, Event, NetworkGroup, ExperienceLevel, Meetup, Reservation, ReservationStatus, LearningItem, ContactMessage, Initiative, InitiativeCategory, UserProfile } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDoc,
  setDoc,
  increment,
  orderBy,
  writeBatch
} from 'firebase/firestore';

// --- STATIC DATA (Kept for seeding/fallback) ---

const learningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Mastering Flow Designer 101',
    category: 'Flow Designer',
    description: 'A complete guide to moving from Workflows to Flow Designer. Includes subflows and action creation.',
    level: ExperienceLevel.BEGINNER,
    steps: 12,
    featured: true
  },
  // ... existing entries ...
];

let jobsStore: Job[] = [
  {
    id: '101',
    title: 'ServiceNow Developer',
    company: 'TechGlobal Solutions',
    location: 'Remote (US)',
    experience: '3-5 Years',
    description: 'Looking for a certified CAD developer with strong Script Include and UI Page experience.',
    postedDate: '2023-10-15',
    applyLink: 'mailto:careers@techglobal.com'
  },
  {
    id: '102',
    title: 'ServiceNow Architect',
    company: 'InnovateCorp',
    location: 'Hyderabad, India',
    experience: '8+ Years',
    description: 'Lead the architecture for a global implementation. Must have ITSM and ITOM expert knowledge.',
    postedDate: '2023-11-01',
    applyLink: 'https://linkedin.com/jobs'
  }
];

// Seed Data for Learning Hub 
let learningItemsStore: LearningItem[] = [
  // --- Modules for Dev Fresher ---
  {
    id: 'l1',
    targetSlug: 'dev-fresher',
    type: 'path',
    title: 'Module 1: Platform Fundamentals',
    description: 'Introduction to Tables, Forms, Lists, and Core Configuration.',
    content: '',
    order: 1
  },
  {
    id: 'l2',
    targetSlug: 'dev-fresher',
    type: 'path',
    title: 'Module 2: Client Side Scripting',
    description: 'Client Scripts, UI Policies, and GlideForm (g_form) API.',
    content: '',
    order: 2
  },
  // --- Interview for Dev Fresher ---
  {
    id: 'i1',
    targetSlug: 'dev-fresher',
    type: 'interview',
    title: 'Difference between UI Policy and Data Policy?',
    description: 'Explain the execution context differences.',
    content: 'UI Policies run on the browser (client-side) only. Data Policies run on the server-side and enforce constraints on data import, web services, and form submissions. UI Policies are for user experience, while Data Policies are for data integrity.',
    order: 1
  },
  {
    id: 'i2',
    targetSlug: 'dev-1-2',
    type: 'interview',
    title: 'Explain Async Business Rules vs After Business Rules',
    description: 'When to use which?',
    content: 'After Business Rules run immediately after the database commit, blocking the user until they finish. Async Business Rules run in the background via a scheduler, returning control to the user immediately. Use Async for integrations or heavy calculations.',
    order: 2
  },
  // --- Business Analyst Content ---
  {
    id: 'ba1',
    targetSlug: 'ba-fresher',
    type: 'path',
    title: 'Module 1: Requirement Gathering 101',
    description: 'How to conduct workshops and document requirements efficiently.',
    content: '',
    order: 1
  },
  {
    id: 'ba2',
    targetSlug: 'ba-fresher',
    type: 'interview',
    title: 'What is a Story in Agile?',
    description: 'Define User Stories.',
    content: 'A User Story is an informal, general explanation of a software feature written from the perspective of the end user. Format: "As a <role>, I want <feature> so that <benefit>."',
    order: 1
  },
  // --- Architect Content ---
  {
    id: 'arch1',
    targetSlug: 'arch-senior',
    type: 'project',
    title: 'Global Instance Consolidation',
    description: 'Strategy for merging 3 regional ServiceNow instances into a single global instance with Domain Separation.',
    content: '',
    order: 1
  },
  // --- Practice Challenges for Dev Fresher ---
  {
    id: 'p1',
    targetSlug: 'dev-fresher',
    type: 'practice',
    title: 'The Missing Query',
    description: 'This script is supposed to log incidents, but returns 0. Fix it.',
    content: `var gr = new GlideRecord('incident');\ngr.addActiveQuery();\n\n// Add missing step\n\nwhile(gr.next()) {\n  gs.info(gr.number);\n}`,
    meta: JSON.stringify({ regex: "gr\\.query\\(\\)", hint: "GlideRecord needs .query() to fetch data." }),
    order: 1
  },
   {
    id: 'p2',
    targetSlug: 'dev-fresher',
    type: 'practice',
    title: 'Scoped App Logging',
    description: 'gs.log() fails in scoped apps. Use the correct API.',
    content: `function check() {\n  gs.log('Error'); // Fix this\n}`,
    meta: JSON.stringify({ regex: "gs\\.info\\(|gs\\.error\\(|gs\\.warn\\(", hint: "Use gs.info(), gs.warn(), or gs.error()." }),
    order: 2
  },
  // --- Quiz for Dev Fresher ---
  // Linked to Module 2 (l2)
  {
    id: 'q1',
    targetSlug: 'dev-fresher',
    moduleId: 'l2', 
    type: 'quiz',
    title: 'Which API is used for client-side form manipulation?',
    description: 'GlideForm (g_form) is the standard client-side API for managing forms.',
    content: JSON.stringify(['GlideRecord', 'GlideSystem', 'GlideForm', 'GlideAggregate']),
    meta: JSON.stringify({ correctIndex: 2 }),
    order: 1
  },
  // Linked to Module 1 (l1)
  {
    id: 'q2',
    targetSlug: 'dev-fresher',
    moduleId: 'l1',
    type: 'quiz',
    title: 'What does "Update" do on a ServiceNow form?',
    description: 'Update saves changes and redirects to the previous page. Save stays on the same page.',
    content: JSON.stringify(['Saves and stays on the form', 'Saves and goes to the list', 'Deletes the record', 'Reloads the form']),
    meta: JSON.stringify({ correctIndex: 1 }),
    order: 2
  }
];

// --- HELPER FUNCTIONS ---

export const calculateSwag = (seatNumber: string): string => {
  if (!seatNumber) return 'Pending Assignment 🎁';
  if (/^[A-H][1-8]$/.test(seatNumber)) {
    const row = seatNumber.charCodeAt(0) - 65; 
    const col = parseInt(seatNumber.slice(1)) - 1;
    const position = row * 8 + col + 1;
    return getSwagFromPosition(position);
  }
  const numericPos = parseInt(seatNumber);
  if (!isNaN(numericPos)) {
    return getSwagFromPosition(numericPos);
  }
  return 'Food & Tea 🍱';
};

const getSwagFromPosition = (position: number): string => {
  if (position <= 80) return 'T-shirt 👕';
  if (position <= 100) return 'Cap 🧢';
  if (position <= 120) return 'Cup ☕';
  return 'Food & Tea 🍱';
}

// --- JOBS CRUD ---

export const getJobs = async (): Promise<Job[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(jobsStore), 300));
};

export const createJob = async (job: Omit<Job, 'id'>): Promise<Job> => {
  const newJob = { ...job, id: Math.random().toString(36).substr(2, 9) };
  jobsStore.unshift(newJob);
  return newJob;
};

export const updateJob = async (id: string, updates: Partial<Job>): Promise<void> => {
  jobsStore = jobsStore.map(j => j.id === id ? { ...j, ...updates } : j);
};

export const deleteJob = async (id: string): Promise<void> => {
  jobsStore = jobsStore.filter(j => j.id !== id);
};

// --- LEARNING HUB CRUD (FIREBASE ENABLED) ---

export const getLearningItems = async (targetSlug?: string): Promise<LearningItem[]> => {
  try {
    const collectionRef = collection(db, "learning_items");
    let q;
    
    if (targetSlug) {
      q = query(collectionRef, where("targetSlug", "==", targetSlug), orderBy("order", "asc"));
    } else {
      q = query(collectionRef, orderBy("order", "asc"));
    }
    
    const snapshot = await getDocs(q);
    
    // ONE-TIME SEEDING LOGIC: If DB is empty, fill it with static data
    // FIX: Using setDoc with explicit IDs so updates to static IDs work correctly.
    if (snapshot.empty) {
        // Check if we have global items already (to prevent duplicate seeding on filtered queries)
        const globalCheck = await getDocs(collection(db, "learning_items"));
        if (globalCheck.empty) {
            console.log("Seeding Learning Hub Data to Firestore...");
            const batch = writeBatch(db);
            learningItemsStore.forEach((item) => {
                // Use the static ID (e.g., 'l1') as the document key
                const docRef = doc(db, "learning_items", item.id);
                // Store the whole item including ID
                batch.set(docRef, item);
            });
            await batch.commit();
            // Recursive call to fetch the newly added data
            return getLearningItems(targetSlug);
        }
    }

    if (snapshot.empty) return []; // If still empty after check

    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as LearningItem));
  } catch (e) {
    console.error("Error fetching learning items:", e);
    // Fallback to static store on error so UI doesn't break
    if (targetSlug) {
        return learningItemsStore.filter(i => i.targetSlug === targetSlug);
    }
    return learningItemsStore;
  }
};

export const createLearningItem = async (item: Omit<LearningItem, 'id'>): Promise<LearningItem> => {
  const docRef = await addDoc(collection(db, "learning_items"), item);
  return { id: docRef.id, ...item };
};

export const updateLearningItem = async (id: string, updates: Partial<LearningItem>): Promise<void> => {
  // Ensure the document exists before updating, or create if missing (using set with merge)
  // This handles cases where static IDs might not be in DB yet if seeding failed partially
  const docRef = doc(db, "learning_items", id);
  await setDoc(docRef, updates, { merge: true });
};

export const deleteLearningItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "learning_items", id));
};


// --- FIREBASE SERVICE METHODS ---

export const getMeetups = async (): Promise<Meetup[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "meetups"));
    const meetups: Meetup[] = [];
    querySnapshot.forEach((doc) => {
      meetups.push({ id: doc.id, ...doc.data() } as Meetup);
    });
    return meetups;
  } catch (error) {
    console.error("Error fetching meetups:", error);
    return [];
  }
};

export const getReservations = async (meetupId: string): Promise<Reservation[]> => {
  try {
    const q = query(collection(db, "reservations"), where("meetupId", "==", meetupId));
    const querySnapshot = await getDocs(q);
    const reservations: Reservation[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reservations.push({ 
        id: doc.id, 
        ...data,
        seatNumber: String(data.seatNumber || ''),
        status: data.status || 'pending', 
        rejectionReason: data.rejectionReason || ''
      } as Reservation);
    });
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};

export const registerUser = async (data: Omit<Reservation, 'id' | 'registeredAt' | 'swag' | 'status'>): Promise<Reservation> => {
  if (data.seatNumber) {
    const q = query(
      collection(db, "reservations"), 
      where("meetupId", "==", data.meetupId),
      where("seatNumber", "==", data.seatNumber)
    );
    const snapshot = await getDocs(q);
    const activeReservation = snapshot.docs.find(doc => {
        const d = doc.data();
        return d.status !== 'rejected';
    });
    if (activeReservation) {
      throw new Error(`Seat ${data.seatNumber} is already booked.`);
    }
  }

  const newReservationData = {
    ...data,
    registeredAt: new Date().toISOString(),
    swag: data.seatNumber ? calculateSwag(data.seatNumber) : 'TBD',
    status: 'pending' as ReservationStatus
  };

  const docRef = await addDoc(collection(db, "reservations"), newReservationData);
  const meetupRef = doc(db, "meetups", data.meetupId);
  const meetupSnap = await getDoc(meetupRef);
  if (meetupSnap.exists()) {
    const currentCount = meetupSnap.data().registrations || 0;
    await updateDoc(meetupRef, { registrations: currentCount + 1 });
  }

  return { id: docRef.id, ...newReservationData };
};

export const deleteReservation = async (reservationId: string, meetupId?: string): Promise<void> => {
  if (!reservationId) return;
  try {
    await deleteDoc(doc(db, "reservations", reservationId));
    if (meetupId) {
      const meetupRef = doc(db, "meetups", meetupId);
      const meetupSnap = await getDoc(meetupRef);
      if (meetupSnap.exists()) {
        const current = meetupSnap.data().registrations || 0;
        await updateDoc(meetupRef, { registrations: Math.max(0, current - 1) });
      }
    }
  } catch (e) {
    console.error("Error in deleteReservation service:", e);
    throw e;
  }
};

export const updateReservation = async (id: string, data: Partial<Reservation>): Promise<void> => {
  await updateDoc(doc(db, "reservations", id), data);
};

// --- ADMIN SERVICES (Firebase) ---

export const checkAdmin = async (u: string, p: string): Promise<boolean> => {
  try {
    const q = query(collection(db, "admins"), where("username", "==", u));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return false;
    const adminDoc = snapshot.docs[0].data();
    if (adminDoc.password === p) return true;
    return false;
  } catch (error) {
    console.error("Admin check failed", error);
    return false;
  }
};

export const createAdmin = async (username: string, password: string, name: string): Promise<boolean> => {
  try {
    const q = query(collection(db, "admins"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) throw new Error("Username already exists");

    await addDoc(collection(db, "admins"), {
      username,
      password,
      name,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Failed to create admin", error);
    throw error;
  }
};

export const createMeetup = async (data: Omit<Meetup, 'id' | 'registrations'>): Promise<Meetup> => {
  const newMeetupData = { ...data, registrations: 0 };
  const docRef = await addDoc(collection(db, "meetups"), newMeetupData);
  return { id: docRef.id, ...newMeetupData } as Meetup;
};

export const updateMeetup = async (id: string, data: Partial<Meetup>): Promise<Meetup> => {
  const meetupRef = doc(db, "meetups", id);
  if (data.capacity !== undefined) {
    const snap = await getDoc(meetupRef);
    if (snap.exists()) {
      const currentRegs = snap.data().registrations || 0;
      if (data.capacity < currentRegs) throw new Error('New capacity cannot be less than current registrations');
    }
  }
  await updateDoc(meetupRef, data);
  return { id, ...data } as Meetup;
};

export const deleteMeetup = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(db, "meetups", id));
  const q = query(collection(db, "reservations"), where("meetupId", "==", id));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);
  return true;
};

// --- CONTACT & PAGE VIEWS SERVICES ---

export const submitContactForm = async (data: Omit<ContactMessage, 'id' | 'submittedAt' | 'read'>): Promise<void> => {
  try {
    await addDoc(collection(db, "contacts"), {
      ...data,
      submittedAt: new Date().toISOString(),
      read: false
    });
  } catch (e) {
    console.error("Error submitting contact form", e);
    throw e;
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const q = query(collection(db, "contacts"), orderBy("submittedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
  } catch (e) {
    console.error("Error fetching messages", e);
    return [];
  }
};

export const updateContactMessage = async (id: string, updates: Partial<ContactMessage>): Promise<void> => {
  await updateDoc(doc(db, "contacts", id), updates);
};

// GLOBAL View Count (Single Counter)
export const incrementPageView = async (): Promise<number> => {
  try {
    // We use a specific document ID "global" in the "site_stats" collection
    const docRef = doc(db, "site_stats", "global");
    
    // Merge true ensures if doc doesn't exist, it is created with count: 1
    // If it exists, count increments
    await setDoc(docRef, { count: increment(1) }, { merge: true });
    
    // Fetch updated count to display
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().count : 0;
  } catch (e) {
    console.error("Page view error", e);
    return 0;
  }
};

export const getPageViews = async (): Promise<number> => {
  try {
    const snap = await getDoc(doc(db, "site_stats", "global"));
    return snap.exists() ? snap.data().count : 0;
  } catch (e) { return 0; }
};

// --- INITIATIVES CONTENT CRUD ---

export const getInitiatives = async (category?: InitiativeCategory): Promise<Initiative[]> => {
  try {
    let q;
    if (category) {
      q = query(collection(db, "initiatives"), where("category", "==", category), orderBy("order", "asc"));
    } else {
      q = query(collection(db, "initiatives"), orderBy("order", "asc"));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Initiative));
  } catch (e) {
    console.error("Error fetching initiatives", e);
    return [];
  }
};

export const createInitiative = async (data: Omit<Initiative, 'id'>): Promise<Initiative> => {
  const docRef = await addDoc(collection(db, "initiatives"), data);
  return { id: docRef.id, ...data };
};

export const updateInitiative = async (id: string, data: Partial<Initiative>): Promise<void> => {
  await updateDoc(doc(db, "initiatives", id), data);
};

export const deleteInitiative = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "initiatives", id));
};

// --- USER PROFILE CRUD (ABOUT ME) ---

const DEFAULT_PROFILE: UserProfile = {
  id: 'main',
  headline: 'About Me',
  bio: "Hi, I'm Shakeel. This platform is my personal initiative to integrate critical sectors of the modern economy. Whether it's training the next generation of tech leaders, exploring culinary arts, or automating complex business processes, my core value remains the same: Impact.",
  journey: "Started as a passionate developer, transitioned into enterprise architecture, and now focused on building communities and sustainable businesses. \n\n2015: Started ServiceNow Journey\n2018: Became Certified Master Architect\n2020: Launched AM Foods\n2023: Founded AM Academy",
  futureGoals: "1. Train 10,000 students in ServiceNow & SAP by 2025.\n2. Expand AM Foods to 10 cities.\n3. Launch a dedicated AI lab for enterprise solutions.",
  certifications: "ServiceNow Certified Master Architect\nServiceNow Certified Technical Architect\nSAP Certified Associate\nScrum Master",
  linkedinBadgeHtml: `<div class="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="light" data-type="HORIZONTAL" data-vanity="shakeel-shaik136" data-version="v1"><a class="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/shakeel-shaik136?trk=profile-badge">Shakeel Shaik</a></div>`,
  stats: [
    { label: "Key Areas", value: "4" },
    { label: "Community Strong", value: "1200+" },
    { label: "Cities Active", value: "3" }
  ]
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const docRef = doc(db, "site_profile", "main");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as UserProfile;
    } else {
      // Seed if missing
      await setDoc(docRef, DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
  } catch (e) {
    console.error("Error fetching profile", e);
    return DEFAULT_PROFILE;
  }
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
  const docRef = doc(db, "site_profile", "main");
  await setDoc(docRef, data, { merge: true });
};

// --- STATIC GETTERS (Unchanged for now) ---

export const getLearningPaths = async (): Promise<LearningPath[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(learningPaths), 300));
};

export const getQuestions = async (): Promise<InterviewQuestion[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([]), 300)); // Deprecated static getter, use getLearningItems
};

export const getEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([]), 300));
};

export const getNetworks = async (): Promise<NetworkGroup[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([]), 300));
};
