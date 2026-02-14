
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