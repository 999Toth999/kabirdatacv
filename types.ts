export interface CVData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  address: string;
  profilePictureUrl: string;
  socials: SocialLink[];
  profile: string;
  stats: Stat[];
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.FC<{className?: string}>;
}

export interface Stat {
    value: string;
    label: string;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  icon: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  details?: string;
}