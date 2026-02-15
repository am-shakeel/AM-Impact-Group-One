
export enum ExperienceLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert'
}

export interface LearningPath {
  id: string;
  title: string;
  category: 'Flow Designer' | 'IntegrationHub' | 'AI/ML' | 'ITSM' | 'HRSD' | 'General';
  description: string;
  level: ExperienceLevel;
  steps: number;
  featured?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  description: string;
  postedDate: string;
  applyLink?: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  company: string;
  role: 'Developer' | 'Admin' | 'Architect' | 'Business Analyst';
}

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  type: 'Meetup' | 'Webinar' | 'Job Mela';
  description: string;
}

export interface NetworkGroup {
  id: string;
  name: string;
  platform: 'WhatsApp' | 'LinkedIn' | 'Telegram';
  link: string;
  members: string;
}

export interface ReservedSeatsConfig {
  hosts: number;
  presenters: number;
  volunteers: number;
  sponsors: number;
}

export interface Meetup {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  type: 'Past' | 'Present' | 'Future';
  capacity: number;
  registrations: number;
  registrationMode?: 'registration' | 'booking' | 'both';
  
  // Seat Configuration
  seatsPerTable?: number; // Default 8
  reservedSeats?: ReservedSeatsConfig;
  
  // Registration Timing
  registrationStart?: string; // ISO datetime
  registrationEnd?: string; // ISO datetime
  isRegistrationClosed?: boolean; // Manual override
}

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected';

export interface Reservation {
  id: string;
  meetupId: string;
  seatNumber: string; // "A1" or "1"
  name: string;
  email: string;
  company: string;
  linkedin: string;
  sessionPresenter: boolean;
  presentationTopic?: string;
  swag: string;
  registeredAt: string;
  isHidden?: boolean;
  status: ReservationStatus;
  rejectionReason?: string;
}

// --- LEARNING HUB TYPES ---

export type LearningContentType = 'path' | 'interview' | 'project' | 'practice' | 'quiz';

export interface LearningItem {
  id: string;
  targetSlug: string; // e.g. 'dev-fresher'
  moduleId?: string;  // ID of the parent 'path' item this content belongs to
  type: LearningContentType;
  title: string;
  description: string; // Used for Explanation in Quizzes
  
  // Flexible content fields based on type
  content?: string; // Used for Interview Answer, Project Details, Sandbox Code, or Quiz Options (JSON)
  meta?: string;    // Used for Duration, Hint, Solution Regex, or Quiz Metadata (JSON: { correctIndex: 0 })
  order?: number;   // For sorting
}

// Helper for Admin UI Dropdowns
export const TARGET_AUDIENCES = [
  // Developers
  { label: 'Developer: Freshers (0-1 yr)', slug: 'dev-fresher' },
  { label: 'Developer: 1-2 Years', slug: 'dev-1-2' },
  { label: 'Developer: 3-5 Years', slug: 'dev-3-5' },
  { label: 'Developer: 6-8 Years', slug: 'dev-6-8' },
  { label: 'Developer: Senior (8+)', slug: 'dev-senior' },
  
  // Architects
  { label: 'Architect: Junior (1-2 yrs)', slug: 'arch-1-2' },
  { label: 'Architect: Mid-Level (3-5 yrs)', slug: 'arch-3-5' },
  { label: 'Architect: Strategy (6-8 yrs)', slug: 'arch-6-8' },
  { label: 'Architect: Senior (8+)', slug: 'arch-senior' },
  
  // Business Analysts
  { label: 'Business Analyst: Fresher', slug: 'ba-fresher' },
  { label: 'Business Analyst: 1-2 Years', slug: 'ba-1-2' },
  { label: 'Business Analyst: 3-5 Years', slug: 'ba-3-5' },
  { label: 'Business Analyst: Senior', slug: 'ba-senior' },

  // Product Owners
  { label: 'Product Owner: 1-2 Years', slug: 'po-1-2' },
  { label: 'Product Owner: 3-5 Years', slug: 'po-3-5' },
  { label: 'Product Owner: Senior', slug: 'po-senior' },
];

// --- NEW TYPES FOR CONTACT & INITIATIVES ---

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export type InitiativeCategory = 'academy' | 'marketing' | 'foods' | 'tech';

export interface Initiative {
  id: string;
  category: InitiativeCategory;
  title: string;
  description: string;
  iconName: string; // Store icon string to map in frontend
  order: number;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface UserProfile {
  id: string; // usually 'main'
  headline: string;
  bio: string;
  journey?: string; // New: Full journey text
  futureGoals?: string; // New: Initiatives & Plans
  certifications?: string; // New: List of achievements
  linkedinBadgeHtml: string;
  stats: ProfileStat[];
}
