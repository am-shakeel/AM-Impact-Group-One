import { Job, LearningPath, InterviewQuestion, Event, NetworkGroup, ExperienceLevel, Meetup, Reservation } from '../types';
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
  getDoc 
} from 'firebase/firestore';

// --- STATIC DATA (Kept in code for simplicity, can be moved to DB later) ---

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
  {
    id: '2',
    title: 'IntegrationHub Enterprise Patterns',
    category: 'IntegrationHub',
    description: 'Connect ServiceNow to Azure, Jira, and SAP using advanced spokes and custom actions.',
    level: ExperienceLevel.ADVANCED,
    steps: 8
  },
  {
    id: '3',
    title: 'Predictive Intelligence & Agent Workspace',
    category: 'AI/ML',
    description: 'Implement ML solutions to auto-categorize incidents and assist agents.',
    level: ExperienceLevel.INTERMEDIATE,
    steps: 10,
    featured: true
  },
  {
    id: '4',
    title: 'HRSD Implementation Bootcamp',
    category: 'HRSD',
    description: 'Configure HR Services, Lifecycle Events, and Employee Center.',
    level: ExperienceLevel.INTERMEDIATE,
    steps: 15
  },
  {
    id: '5',
    title: 'ITSM Fundamentals to Architect',
    category: 'ITSM',
    description: 'Deep dive into Incident, Problem, Change, and CMDB health.',
    level: ExperienceLevel.BEGINNER,
    steps: 20
  }
];

const jobs: Job[] = [
  {
    id: '101',
    title: 'ServiceNow Developer',
    company: 'TechGlobal Solutions',
    location: 'Remote (US)',
    experience: '3-5 Years',
    description: 'Looking for a certified CAD developer with strong Script Include and UI Page experience.',
    postedDate: '2023-10-15'
  },
  {
    id: '102',
    title: 'ServiceNow Architect',
    company: 'Innovate Corp',
    location: 'Bangalore, India',
    experience: '8+ Years',
    description: 'Lead the migration to cloud and oversee CMDB architecture.',
    postedDate: '2023-10-18'
  },
  {
    id: '103',
    title: 'Junior ServiceNow Admin',
    company: 'NextGen IT',
    location: 'London, UK',
    experience: '0-2 Years',
    description: 'Great opportunity for CSA certified freshers. Training provided.',
    postedDate: '2023-10-20'
  },
  {
    id: '104',
    title: 'HRSD Consultant',
    company: 'Peoples First',
    location: 'Remote',
    experience: '4+ Years',
    description: 'Specialist needed for Employee Center Pro implementation.',
    postedDate: '2023-10-22'
  }
];

const questions: InterviewQuestion[] = [
  {
    id: '201',
    question: 'What is the difference between a Business Rule and a Client Script?',
    answer: 'A Client Script runs on the client-side (browser) when forms are loaded or changed. A Business Rule runs on the server-side when records are queried, inserted, updated, or deleted.',
    company: 'Accenture',
    role: 'Developer'
  },
  {
    id: '202',
    question: 'Explain the purpose of the Update Set.',
    answer: 'An Update Set is a group of configuration changes that can be moved from one instance to another. It allows developers to group related changes and apply them to other systems (e.g., Dev to Test).',
    company: 'Deloitte',
    role: 'Admin'
  },
  {
    id: '203',
    question: 'How do you prevent a Business Rule from running recursively?',
    answer: 'You can prevent recursive Business Rules by using the condition `current.setWorkflow(false)` within your script or ensuring your condition logic is precise to avoid infinite loops.',
    company: 'Infosys',
    role: 'Developer'
  },
  {
    id: '204',
    question: 'Describe Domain Separation and when you would use it.',
    answer: 'Domain Separation allows you to separate data, processes, and UI into logical groupings called domains. It is typically used by MSPs (Managed Service Providers) to support multiple customers on a single instance.',
    company: 'ServiceNow',
    role: 'Architect'
  }
];

const events: Event[] = [
  {
    id: '301',
    title: 'ServiceNow Developer Meetup - Q4',
    location: 'Online (Zoom)',
    date: 'Nov 15, 2023',
    type: 'Meetup',
    description: 'Community gathering to discuss the latest Vancouver release features.'
  },
  {
    id: '302',
    title: 'AM Impact Job Mela 2023',
    location: 'Hyderabad Convention Center',
    date: 'Dec 05, 2023',
    type: 'Job Mela',
    description: 'Mega recruitment drive with 20+ top tier companies hiring ServiceNow professionals.'
  },
  {
    id: '303',
    title: 'Flow Designer Masterclass',
    location: 'Youtube Live',
    date: 'Oct 30, 2023',
    type: 'Webinar',
    description: 'Live coding session demonstrating complex flow logic and error handling.'
  }
];

const networks: NetworkGroup[] = [
  {
    id: '401',
    name: 'ServiceNow Developers Global',
    platform: 'WhatsApp',
    link: '#',
    members: '450+'
  },
  {
    id: '402',
    name: 'AM Impact - Job Seekers',
    platform: 'LinkedIn',
    link: '#',
    members: '1200+'
  },
  {
    id: '403',
    name: 'ServiceNow Architects Circle',
    platform: 'Telegram',
    link: '#',
    members: '300+'
  }
];

// --- HELPER FUNCTIONS ---

// Helper to calculate swag based on seat index/number
// Logic Matches: (seatChar * 8) + seatNum + 1
const calculateSwag = (seatNumber: string): string => {
  // If seat is "A1", "H8", etc.
  if (/^[A-H][1-8]$/.test(seatNumber)) {
    const row = seatNumber.charCodeAt(0) - 65; // A=0, B=1...
    const col = parseInt(seatNumber.slice(1)) - 1; // 1=0, 2=1...
    
    // Position 1 to 64
    const position = row * 8 + col + 1;
    
    // Specific grid logic if needed, but using general buckets provided:
    // "Seats 81–100 receive a Cap" - this implies we might expect > 64 seats or numeric seats.
    // The previous logic handled numeric fallback.
    return getSwagFromPosition(position);
  }

  // Fallback for numeric only inputs
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
      // Ensure seatNumber is treated as a string to prevent localeCompare errors in UI
      reservations.push({ 
        id: doc.id, 
        ...data,
        seatNumber: String(data.seatNumber || '') 
      } as Reservation);
    });
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};

export const registerUser = async (data: Omit<Reservation, 'id' | 'registeredAt' | 'swag'>): Promise<Reservation> => {
  // 1. Check if seat is already taken in DB
  if (data.seatNumber) {
    const q = query(
      collection(db, "reservations"), 
      where("meetupId", "==", data.meetupId),
      where("seatNumber", "==", data.seatNumber)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error(`Seat ${data.seatNumber} is already booked.`);
    }
  } else {
    // Basic auto-assignment fallback
    const existing = await getReservations(data.meetupId);
    data.seatNumber = (existing.length + 65).toString(); 
  }

  // 2. Create Reservation Object
  const newReservationData = {
    ...data,
    registeredAt: new Date().toISOString(),
    swag: calculateSwag(data.seatNumber)
  };

  // 3. Add to Firestore
  const docRef = await addDoc(collection(db, "reservations"), newReservationData);
  
  // 4. Update Meetup Registration Count
  const meetupRef = doc(db, "meetups", data.meetupId);
  const meetupSnap = await getDoc(meetupRef);
  
  if (meetupSnap.exists()) {
    const currentCount = meetupSnap.data().registrations || 0;
    await updateDoc(meetupRef, {
      registrations: currentCount + 1
    });
  }

  return { id: docRef.id, ...newReservationData };
};

export const deleteReservation = async (reservationId: string, meetupId: string): Promise<void> => {
  await deleteDoc(doc(db, "reservations", reservationId));
  
  // Decrement registration count
  const meetupRef = doc(db, "meetups", meetupId);
  const meetupSnap = await getDoc(meetupRef);
  if (meetupSnap.exists()) {
    const current = meetupSnap.data().registrations || 0;
    await updateDoc(meetupRef, { registrations: Math.max(0, current - 1) });
  }
};

export const updateReservation = async (id: string, data: Partial<Reservation>): Promise<void> => {
  await updateDoc(doc(db, "reservations", id), data);
};

// --- ADMIN SERVICES (Firebase) ---

// Real implementation checking Firestore 'admins' collection
export const checkAdmin = async (u: string, p: string): Promise<boolean> => {
  try {
    const q = query(collection(db, "admins"), where("username", "==", u));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return false;
    }

    // In a real app, hash passwords. Here we compare plaintext as per your previous implementation.
    const adminDoc = snapshot.docs[0].data();
    if (adminDoc.password === p) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Admin check failed", error);
    return false;
  }
};

// Create new admin (Setup functionality)
export const createAdmin = async (username: string, password: string, name: string): Promise<boolean> => {
  try {
    // Check if username exists
    const q = query(collection(db, "admins"), where("username", "==", username));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error("Username already exists");
    }

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
  const newMeetupData = {
    ...data,
    registrations: 0
  };
  const docRef = await addDoc(collection(db, "meetups"), newMeetupData);
  return { id: docRef.id, ...newMeetupData } as Meetup;
};

export const updateMeetup = async (id: string, data: Partial<Meetup>): Promise<Meetup> => {
  const meetupRef = doc(db, "meetups", id);
  
  // Optional: Validation check before update
  if (data.capacity !== undefined) {
    const snap = await getDoc(meetupRef);
    if (snap.exists()) {
      const currentRegs = snap.data().registrations || 0;
      if (data.capacity < currentRegs) {
        throw new Error('New capacity cannot be less than current registrations');
      }
    }
  }

  await updateDoc(meetupRef, data);
  return { id, ...data } as Meetup; // Return approximate updated object
};

export const deleteMeetup = async (id: string): Promise<boolean> => {
  // 1. Delete the meetup
  await deleteDoc(doc(db, "meetups", id));

  // 2. Cleanup reservations (Optional but recommended)
  // Firestore doesn't cascade delete automatically.
  const q = query(collection(db, "reservations"), where("meetupId", "==", id));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  return true;
};

// --- STATIC GETTERS (Unchanged for now) ---

export const getLearningPaths = async (): Promise<LearningPath[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(learningPaths), 300));
};

export const getJobs = async (): Promise<Job[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(jobs), 300));
};

export const getQuestions = async (): Promise<InterviewQuestion[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(questions), 300));
};

export const getEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(events), 300));
};

export const getNetworks = async (): Promise<NetworkGroup[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(networks), 300));
};
