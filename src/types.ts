export type UserStatus = 'free' | 'single_paid' | 'pro';

export interface UserProfile {
  uid: string;
  email: string;
  status: UserStatus;
  lastPaymentDate?: string;
  subscriptionEndDate?: string;
}

export interface ResumeData {
  templateId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    jobTitle: string;
    summary: string;
    photo?: string;
    targetJob?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  projects: Project[];
  interests: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g., "A1", "C2", "Maternel"
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}
