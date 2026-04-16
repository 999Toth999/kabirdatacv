import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import type { CVData, Experience, Education, SocialLink, Stat, Language, Book } from './types';

// --- ICONS ---
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>
);
const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={className}><path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path></svg>
);
const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className={className}><path d="M228 152v56a20 20 0 0 1-20 20H48a20 20 0 0 1-20-20v-56a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0Zm-108.49 8.49a12 12 0 0 0 17 0l40-40a12 12 0 0 0-17-17L140 123V40a12 12 0 0 0-24 0v83l-19.51-19.49a12 12 0 0 0-17 17Z"></path></svg>
);
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
);
const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const GraduationCapIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"></path></svg>;
const WrenchIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>;
const PaperPlaneIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/></svg>;
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const BookIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const GlobeIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const UserIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;

// --- DATA ---
const cvData: CVData = {
  name: "Kabir Hasenbalg",
  title: "Product Builder & AI Automation Specialist | Full-Stack Developer (Supabase + React) | Solo Founder | 0→1 Execution",
  location: "Buenos Aires, Argentina",
  email: "kabirhasen@gmail.com",
  phone: "+54 91168143855",
  address: "Buenos Aires, Argentina",
  profilePictureUrl: "/ka-profile.jpg",
  
  socials: [
    { name: "GitHub", url: "https://github.com/djeliteglobal", icon: GithubIcon },
    { name: "LinkedIn", url: "https://linkedin.com/in/kabirhasenbalg", icon: LinkedInIcon },
    { name: "Instagram", url: "https://www.instagram.com/kabir.ph/", icon: InstagramIcon },
  ],
  
  profile: "I build digital products and grow them — technically and with content. Currently building an autonomous outbound sales system using multi-agent orchestration. Shipped DJElite (Supabase + React) in 3 months as a solo founder. Grew On The Ground Sound to 3K+ users organically — one Reel hit 1.9M views. Now focused on AI enablement and CRM automation for startups that want real ownership in their operator.",
  
  stats: [
    { value: "1.9M", label: "Views, 1 Reel" },
    { value: "105K", label: "YouTube Views" },
    { value: "3K+", label: "Users Grown ($0 Ads)" },
    { value: "4", label: "Languages" },
  ],
  
  keyAchievements: [
    "Produced an Instagram Reel that reached 1,900,000 views, 60,100 likes, and 781 comments organically — driving 33% follower growth in 7 days.",
    
    "Built DJElite end-to-end in 3 months as solo founder: Supabase (Auth, Realtime, PostgreSQL), React, TypeScript, OAuth, Stripe, Ably — Tinder-style matching, real-time chat, and event monetization.",
    
    "Grew On The Ground Sound from 0 to 3,000+ users with $0 ad spend through organic content strategy and automated cross-platform publishing."
  ],
  
  skills: [
    { 
      name: "Build & Ship", 
      items: [
        "Multi-Agent Systems (Paperclip, Hermes, MemPalace)",
        "Supabase (Auth, Realtime, PostgreSQL)", 
        "React, TypeScript, JavaScript", 
        "AI APIs (Minimax, Claude, OpenAI)",
        "OAuth, Stripe, Ably Integration",
        "Python, N8N Automation"
      ] 
    },
    { 
      name: "Grow & Operate", 
      items: [
        "Social Media Management (Sprout Social, Hootsuite)",
        "Email & CRM Automation", 
        "Organic Content Strategy",
        "Video Production & After Effects",
        "Cross-platform Publishing"
      ] 
    }
  ],
  
  experience: [
    {
      company: "Independent — Product & AI Automation",
      role: "Founder & Operator",
      period: "2019 - Present",
      location: "Buenos Aires / Barcelona / Remote",
      description: [
        "Building an autonomous sales system with multi-agent orchestration (Paperclip, Hermes, Agentmail) — generates custom landing pages per prospect, handles Stripe payments, sent 900+ campaigns managed via Discord.",
        
        "Led content and community for On The Ground Sound (Amsterdam) — produced 12 DJ mix videos (105K YouTube views), created After Effects intro for Instagram brand, organized 5 live events, and automated 160+ posts across 5 platforms.",
        
        "Personally curated all DJ submissions, engaged daily with platform users, and delivered continuous UX improvement ideas to the dev team.",
        
        "Audiovisual production and social media consulting for international clients (@kabir.ph) — directed 40+ models at The Loft Studios, produced video campaigns, managed multi-platform content strategies."
      ],
      icon: "🚀"
    }
  ],
  
  education: [
    { 
      degree: "Model Context Protocol (MCP)", 
      institution: "Anthropic", 
      period: "2026 - Ongoing" 
    },
    { 
      degree: "CS50: Intro to Computer Science", 
      institution: "Harvard University (edX)", 
      period: "Ongoing" 
    },
    { 
      degree: "Design in Image and Sound", 
      institution: "University of Buenos Aires (FADU)", 
      period: "2014 - 2015" 
    },
    { 
      degree: "Music Production", 
      institution: "Berklee College of Music (Coursera)", 
      period: "2015" 
    },
    { 
      degree: "Python & Data Automation", 
      institution: "Universidad de Buenos Aires", 
      period: "2014 - 2015" 
    }
  ],
  
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Native" },
    { name: "Portuguese", level: "Professional" },
    { name: "Italian", level: "Professional" },
  ],
  
  workingStyle: [],
  
  books: [
    { title: "Pitch Anything", author: "Oren Klaff", category: "Business" },
    { title: "The 4-Hour Work Week", author: "Tim Ferriss", category: "Business" },
    { title: "Blue Ocean Strategy", author: "W. Chan Kim", category: "Business" },
    { title: "7 Habits of Highly Effective People", author: "Stephen Covey", category: "Mindset" },
    { title: "How to Win Friends and Influence People", author: "Dale Carnegie", category: "Mindset" },
    { title: "The Psychology of Money", author: "Morgan Housel", category: "Mindset" },
  ],
};;

// --- ANIMATION COMPONENTS ---
const AnimatedItem: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay = 0 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} transition-all duration-700 ease-out`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

const TypingAnimator: React.FC<{ words: string[]; className?: string }> = ({ words, className }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === words[index].length && !isDeleting) {
      const timer = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timer);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 75 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  const currentText = words[index].substring(0, subIndex);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-blink text-brand-green">|</span>
    </span>
  );
};


// --- HELPER COMPONENTS ---
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <section className={`py-8 ${className}`} id={title.toLowerCase().replace(/\s/g, '-')} style={className.includes('break-before-page') ? {pageBreakBefore: 'always'} : {}}>
     <AnimatedItem delay={0}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 text-brand-text-light">{icon}</div>
          <h2 className="font-display text-3xl font-medium text-brand-text-light">{title}</h2>
        </div>
    </AnimatedItem>
    <div className="space-y-4">
      {children}
    </div>
  </section>
);

const ExperienceCard: React.FC<{ item: Experience }> = ({ item }) => (
  <div className="p-6 bg-brand-dark rounded-xl border border-brand-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
          <div className="flex items-center gap-4">
              <div className="text-3xl">{item.icon}</div>
              <div>
                  <h3 className="font-display text-xl font-semibold text-brand-text-light">{item.role}</h3>
                  <p className="text-base">{item.company} - {item.location.split(',')[0]}</p>
              </div>
          </div>
          <div className="text-sm py-1.5 px-3 bg-brand-gray border border-brand-border rounded-md font-medium whitespace-nowrap">{item.period}</div>
      </div>
      <hr className="border-brand-border my-4" />
      <ul className="list-disc list-inside space-y-2 text-base font-medium pl-4">
        {item.description.map((point, index) => <li key={index}>{point}</li>)}
      </ul>
  </div>
);

const EducationCard: React.FC<{ item: Education }> = ({ item }) => (
    <div className="p-6 bg-brand-dark rounded-xl border border-brand-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <div>
                <h3 className="font-display text-xl font-semibold text-brand-text-light">{item.degree}</h3>
                <p className="text-base">{item.institution}</p>
            </div>
            <div className="text-sm py-1.5 px-3 bg-brand-gray border border-brand-border rounded-md font-medium whitespace-nowrap">{item.period}</div>
        </div>
        {item.details && <p className="text-sm font-medium text-brand-text-dark mt-2">{item.details}</p>}
    </div>
);

const ContactForm = () => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(form) as any).toString()
            });
            if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Error sending message. Please try again.');
            }
        } catch (error) {
            alert('Error sending message. Please try again.');
        }
    };

    return (
        <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="space-y-4" onSubmit={handleSubmit}>
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />
            <input type="text" name="name" placeholder="Full Name" required className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors" />
            <input type="email" name="email" placeholder="Email" required className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors" />
            <textarea name="message" placeholder="Message" rows={4} required className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"></textarea>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                Send Message <SendIcon className="w-4 h-4"/>
            </button>
        </form>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const roles = cvData.title.split(' | ');
  const cvRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210;
    const pageH = 297;
    let y = 12;

    // Brand colors (RGB)
    const black: [number, number, number] = [0, 0, 0];
    const dark: [number, number, number] = [16, 16, 16];
    const gray: [number, number, number] = [31, 31, 31];
    const border: [number, number, number] = [48, 48, 48];
    const green: [number, number, number] = [40, 233, 140];
    const white: [number, number, number] = [255, 255, 255];
    const muted: [number, number, number] = [153, 153, 153];

    // Replace Unicode chars unsupported by jsPDF built-in fonts (WinAnsiEncoding)
    const sanitize = (s: string) => s.replace(/\u2192/g, '->').replace(/\u2014/g, '--').replace(/\u2013/g, '-');

    const fillPage = () => { pdf.setFillColor(...black); pdf.rect(0, 0, pageW, pageH, 'F'); };
    fillPage();

    const CARD_GAP = 4;   // vertical gap between cards (reduced to fit more)
    const LH = 6.0;       // base line height for body text (reduced to fit more)
    const PAD = 4;        // inner card padding (reduced)
    const PAD_TOP = 4;    // top padding for experience cards (reduced)
    const margin = 12;
    const contentW = pageW - margin * 2;

    const checkPage = (needed: number) => {
      if (y + needed > pageH - margin) { pdf.addPage(); fillPage(); y = margin; }
    };

    const drawCardAt = (x: number, cy: number, w: number, h: number) => {
      pdf.setFillColor(...dark); pdf.roundedRect(x, cy, w, h, 2, 2, 'F');
      pdf.setDrawColor(...border); pdf.roundedRect(x, cy, w, h, 2, 2, 'S');
    };
    const drawCard = (x: number, w: number, h: number) => drawCardAt(x, y, w, h);

    const sectionTitle = (title: string, icon?: string) => {
      checkPage(20);
      pdf.setFillColor(...green); pdf.rect(margin, y, 3, 7, 'F');
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.setTextColor(...white);
      const titleText = icon ? `${icon} ${title}` : title;
      pdf.text(titleText, margin + 7, y + 5.5);
      y += 12;
    };

    // ===== HEADER (with profile photo) =====
    const headerH = 35;
    const photoSize = 26;
    pdf.setFillColor(...dark); pdf.roundedRect(margin, y, contentW, headerH, 3, 3, 'F');
    pdf.setDrawColor(...border); pdf.roundedRect(margin, y, contentW, headerH, 3, 3, 'S');

    // Load and embed profile photo
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = cvData.profilePictureUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d')!;
      ctx.beginPath(); ctx.arc(100, 100, 100, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(img, 0, 0, 200, 200);
      const dataUrl = canvas.toDataURL('image/png');
      pdf.addImage(dataUrl, 'PNG', margin + 6, y + (headerH - photoSize) / 2, photoSize, photoSize);
    } catch { /* skip photo if it fails to load */ }

    const textX = margin + 6 + photoSize + 6;
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(17); pdf.setTextColor(...white);
    pdf.text(cvData.name, textX, y + 8);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...green);
    // Use only first part of title for PDF (shorter)
    const pdfTitle = cvData.title.split(' | ')[0];
    pdf.text(sanitize(pdfTitle), textX, y + 14);
    pdf.setFontSize(8); pdf.setTextColor(...muted);
    pdf.text(`${cvData.email}  |  ${cvData.phone}  |  ${cvData.location}`, textX, y + 20);
    const linkedIn = cvData.socials.find(s => s.name === 'LinkedIn');
    const github = cvData.socials.find(s => s.name === 'GitHub');
    const linksText = [linkedIn && linkedIn.url, github && github.url].filter(Boolean).join('  |  ');
    if (linksText) { pdf.text(linksText, textX, y + 26); }
    y += headerH + 4;

    // ===== PROFILE =====
    sectionTitle('Profile', '>>');
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...muted);
    const profileLines = pdf.splitTextToSize(sanitize(cvData.profile), contentW - 8);
    checkPage(profileLines.length * LH + 4);
    let profileY = y;
    profileLines.forEach(line => {
      pdf.text(line, margin + 4, profileY);
      profileY += LH;
    });
    y = profileY + 3;

    // ===== STATS =====
    const statW = (contentW - 9) / 4;
    const statH = 14;
    checkPage(statH + CARD_GAP);
    cvData.stats.forEach((stat, i) => {
      const sx = margin + i * (statW + 3);
      drawCard(sx, statW, statH);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(...green);
      pdf.text(stat.value, sx + statW / 2, y + statH / 2 - 0.5, { align: 'center' });
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7); pdf.setTextColor(...muted);
      pdf.text(stat.label, sx + statW / 2, y + statH / 2 + 3.5, { align: 'center' });
    });
    y += statH + CARD_GAP;

    // ===== KEY ACHIEVEMENTS =====
    sectionTitle('Key Achievements', '>>');
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...muted);
    cvData.keyAchievements.forEach(achievement => {
      const lines = pdf.splitTextToSize(sanitize(`• ${achievement}`), contentW - 8);
      checkPage(lines.length * LH + 2);
      let achY = y;
      lines.forEach(line => {
        pdf.text(line, margin + 4, achY);
        achY += LH;
      });
      y = achY + 1;
    });
    y += 4;

    // ===== EXPERIENCE =====
    sectionTitle('Experience', '>>');
    cvData.experience.forEach(exp => {
      const bullets = exp.description;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
      const bulletLines = bullets.map(b => pdf.splitTextToSize(sanitize(`• ${b}`), contentW - 2 * PAD));
      const totalLines = bulletLines.reduce((sum, lines) => sum + lines.length, 0);
      const cardH = PAD_TOP + 18 + totalLines * LH + PAD;
      checkPage(cardH + CARD_GAP);
      drawCard(margin, contentW, cardH);
      const cx = margin + PAD;
      let cy = y + PAD_TOP + 4;
      // Add icon indicator
      const iconSymbol = '>';
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...green);
      pdf.text(iconSymbol, cx, cy);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(...white);
      pdf.text(exp.role, cx + 8, cy);
      cy += 5.5;
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...green);
      pdf.text(exp.company, cx + 8, cy);
      cy += 5;
      pdf.setTextColor(...muted); pdf.setFontSize(8);
      pdf.text(`${exp.period}  •  ${exp.location}`, cx + 8, cy);
      cy += 7;
      pdf.setTextColor(...muted); pdf.setFontSize(8);
      bulletLines.forEach(lines => {
        lines.forEach(line => {
          pdf.text(line, cx + 8, cy);
          cy += LH;
        });
      });
      y += cardH + CARD_GAP;
    });

    // ===== EDUCATION =====
    const eduColW = (contentW - 4) / 2;
    const eduCardH = 20;
    const eduRows = Math.ceil(cvData.education.length / 2);
    const totalEduHeight = 12 + eduRows * (eduCardH + CARD_GAP); // Include section title height
    // Check if entire education section (title + cards) fits, otherwise move to next page
    checkPage(totalEduHeight);
    sectionTitle('Education', '>>');
    for (let i = 0; i < cvData.education.length; i += 2) {
      for (let j = 0; j < 2; j++) {
        const edu = cvData.education[i + j];
        if (!edu) break;
        const ex = margin + j * (eduColW + 4);
        drawCard(ex, eduColW, eduCardH);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
        pdf.text(edu.degree, ex + PAD, y + PAD + 4, { maxWidth: eduColW - 2 * PAD - 18 });
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
        pdf.text(edu.institution, ex + PAD, y + PAD + 10);
        pdf.setFontSize(7); pdf.setTextColor(...green);
        pdf.text(edu.period, ex + eduColW - PAD, y + PAD + 4, { align: 'right' });
      }
      y += eduCardH + CARD_GAP;
    }

    // ===== CORE SKILLS =====
    sectionTitle('Core Skills', '>>');
    const skillColW = (contentW - 4) / 2;
    for (let i = 0; i < cvData.skills.length; i += 2) {
      const heights: number[] = [0, 0];
      const itemLines: string[][][] = [[], []];
      for (let j = 0; j < 2; j++) {
        const cat = cvData.skills[i + j];
        if (!cat) break;
        let totalLines = 0;
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
        cat.items.forEach(item => {
          const lines = pdf.splitTextToSize(sanitize(`• ${item}`), skillColW - 2 * PAD);
          itemLines[j].push(lines);
          totalLines += lines.length;
        });
        heights[j] = PAD + 10 + totalLines * LH + PAD;
      }
      const rowH = Math.max(heights[0], heights[1]);
      checkPage(rowH + CARD_GAP);
      for (let j = 0; j < 2; j++) {
        const cat = cvData.skills[i + j];
        if (!cat) break;
        const sx = margin + j * (skillColW + 4);
        drawCardAt(sx, y, skillColW, rowH);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...white);
        pdf.text(cat.name, sx + PAD, y + PAD + 5);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
        let iy = y + PAD + 12;
        itemLines[j].forEach(lines => {
          lines.forEach(line => {
            pdf.text(line, sx + PAD, iy);
            iy += LH;
          });
        });
      }
      y += rowH + CARD_GAP;
    }

    // ===== LANGUAGES =====
    sectionTitle('Languages', '@');
    const langW = (contentW - 9) / 4;
    const langH = 15;
    checkPage(langH + CARD_GAP);
    cvData.languages.forEach((lang, i) => {
      const lx = margin + i * (langW + 3);
      drawCard(lx, langW, langH);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...white);
      pdf.text(lang.name, lx + langW / 2, y + langH / 2 - 2, { align: 'center' });
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
      pdf.text(lang.level, lx + langW / 2, y + langH / 2 + 3.5, { align: 'center' });
    });
    y += langH + CARD_GAP;

    // ===== WORKING STYLE =====
    if (cvData.workingStyle.length > 0) {
    sectionTitle('Working Style');
    const wsColW = (contentW - 4) / 2;
    for (let i = 0; i < cvData.workingStyle.length; i += 2) {
      const heights: number[] = [0, 0];
      const descLinesArr: string[][] = [[], []];
      for (let j = 0; j < 2; j++) {
        const item = cvData.workingStyle[i + j];
        if (!item) break;
        const [, ...rest] = item.split(': ');
        const desc = sanitize(rest.join(': '));
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
        const descLines = pdf.splitTextToSize(desc, wsColW - 2 * PAD);
        descLinesArr[j] = descLines;
        heights[j] = PAD + 10 + descLines.length * LH + PAD;
      }
      const rowH = Math.max(heights[0], heights[1]);
      checkPage(rowH + CARD_GAP);
      for (let j = 0; j < 2; j++) {
        const item = cvData.workingStyle[i + j];
        if (!item) break;
        const [title] = item.split(': ');
        const wx = margin + j * (wsColW + 4);
        drawCardAt(wx, y, wsColW, rowH);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
        pdf.text(title, wx + PAD, y + PAD + 5);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
        let descY = y + PAD + 11;
        descLinesArr[j].forEach(line => {
          pdf.text(line, wx + PAD, descY);
          descY += LH;
        });
      }
      y += rowH + CARD_GAP;
    }
    } // end workingStyle

    // ===== CONTINUOUS LEARNING =====
    // Only add page if we're still on page 1 and near the end
    if (pdf.getCurrentPageInfo().pageNumber === 1 && y > pageH - 80) { 
      pdf.addPage(); fillPage(); y = margin; 
    }
    sectionTitle('Continuous Learning', '>>');
    const bookCategories = cvData.books.reduce((acc, book) => {
      if (!acc[book.category]) acc[book.category] = [];
      acc[book.category].push(book);
      return acc;
    }, {} as Record<string, typeof cvData.books>);
    const catEntries = Object.entries(bookCategories);
    const bookColW = (contentW - (catEntries.length - 1) * 3) / catEntries.length;
    const bPad = PAD;
    const catBookLines: { titleLines: string[]; author: string }[][] = catEntries.map(([, books]) => {
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8);
      return books.map(book => ({
        titleLines: pdf.splitTextToSize(book.title, bookColW - 2 * bPad),
        author: book.author,
      }));
    });
    const catHeights = catBookLines.map(bookLines => {
      let h = bPad + 10;
      bookLines.forEach(({ titleLines }) => { h += titleLines.length * LH + LH + 3; });
      return h + bPad;
    });
    const bookCardH = Math.max(...catHeights);
    checkPage(bookCardH + CARD_GAP);
    catEntries.forEach(([category], i) => {
      const bx = margin + i * (bookColW + 3);
      drawCardAt(bx, y, bookColW, bookCardH);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
      pdf.text(category, bx + bPad, y + bPad + 5);
      let by = y + bPad + 12;
      catBookLines[i].forEach(({ titleLines, author }) => {
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...white);
        titleLines.forEach(line => {
          pdf.text(line, bx + bPad, by);
          by += LH;
        });
        by += 1;
        pdf.setFontSize(7); pdf.setTextColor(...muted);
        pdf.text(author, bx + bPad, by);
        by += LH + 3;
      });
    });
    y += bookCardH + CARD_GAP;

    // ===== CONTACT (inline, no section title to save space) =====
    checkPage(8);
    y += 2;
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
    pdf.text(`Phone: ${cvData.phone}  |  Email: ${cvData.email}  |  ${cvData.address}`, pageW / 2, y, { align: 'center' });
    y += 6;

    pdf.save('Kabir_Hasenbalg_CV.pdf');
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 md:p-16 lg:p-20" ref={cvRef}>
      <div className="max-w-[1360px] mx-auto lg:grid lg:grid-cols-12 lg:gap-16">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-16 h-max mb-8 lg:mb-0">
          <div className="bg-brand-dark border border-brand-border rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-brand-border mb-4">
              <img src={cvData.profilePictureUrl} alt={cvData.name} className="w-full h-full object-cover" />
            </div>
            <div className="relative inline-block py-1 px-4 text-sm bg-brand-gray border border-brand-border rounded-lg mb-4">
                <span className="absolute top-1/2 left-2 -translate-y-1/2 w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                <span className="ml-2">Available for work</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-brand-text-light">{cvData.name}</h1>
            
            <div className="flex gap-3 my-6">
              {cvData.socials.map(social => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="w-12 h-12 flex items-center justify-center bg-brand-gray border border-brand-border rounded-full text-brand-text-light hover:bg-brand-border transition-colors">
                    <social.icon className="w-6 h-6 fill-current" />
                </a>
              ))}
            </div>

            <div className="w-full flex flex-col sm:flex-row lg:flex-col gap-3">
                <button onClick={downloadPDF} className="flex-1 flex items-center justify-center gap-2 bg-brand-gray text-brand-text-light font-semibold py-3 px-4 rounded-lg hover:bg-brand-border transition-colors text-base">
                    <DownloadIcon className="w-5 h-5" /> Download CV
                </button>
                <a href={`mailto:${cvData.email}`} className="flex-1 bg-brand-green text-black font-semibold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors text-base">Contact Me</a>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="lg:col-span-8 space-y-16">
          {/* Intro */}
          <section className="py-8 min-h-[400px]">
            <AnimatedItem>
                <p className="font-display text-3xl mb-4 text-brand-text-light">👋 Say Hello</p>
            </AnimatedItem>
            <AnimatedItem delay={100}>
                <h1 className="font-display text-5xl md:text-6xl font-bold text-brand-text-light leading-tight mb-6 min-h-[240px] md:min-h-[120px]">I'm <span className="text-brand-text-light">{cvData.name}</span>, <TypingAnimator words={roles} className="text-brand-green" /></h1>
            </AnimatedItem>
            <AnimatedItem delay={200}>
                <p className="text-lg mb-8 font-medium">{cvData.profile}</p>
            </AnimatedItem>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {cvData.stats.map((stat, index) => (
                    <AnimatedItem key={stat.label} delay={300 + index * 100}>
                        <div className="bg-brand-dark border border-brand-border p-6 rounded-lg text-center">
                            <p className="text-4xl font-display font-bold text-brand-green">{stat.value}</p>
                            <p className="text-sm mt-1">{stat.label}</p>
                        </div>
                    </AnimatedItem>
                ))}
            </div>
          </section>

          {/* Key Achievements */}
          <Section title="Key Achievements" icon={<TrendingUpIcon />}>
              <div className="bg-brand-dark border border-brand-border p-6 rounded-xl">
                  <div className="space-y-4">
                      {cvData.keyAchievements.map((achievement, index) => (
                          <AnimatedItem key={index} delay={index * 100}>
                              <div className="flex items-start gap-3">
                                  <span className="text-brand-green text-xl font-bold">•</span>
                                  <p className="text-base font-medium text-brand-text-light">{achievement}</p>
                              </div>
                          </AnimatedItem>
                      ))}
                  </div>
              </div>
          </Section>

          {/* Experience */}
          <Section title="Experience" icon={<BriefcaseIcon />}>
              {cvData.experience.map((item, index) => (
                <AnimatedItem key={index} delay={index * 100}>
                    <ExperienceCard item={item} />
                </AnimatedItem>
              ))}
          </Section>

          {/* Education */}
          <Section title="Education" icon={<GraduationCapIcon />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cvData.education.map((item, index) => (
                    <AnimatedItem key={item.degree} delay={index * 100}>
                        <EducationCard item={item} />
                    </AnimatedItem>
                ))}
            </div>
          </Section>

          {/* Core Skills */}
          <Section title="Core Skills" icon={<WrenchIcon />} className="break-before-page">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cvData.skills.map((category, index) => (
                    <AnimatedItem key={category.name} delay={index * 100}>
                        <div className="bg-brand-dark border border-brand-border p-6 rounded-xl h-full">
                            <h3 className="font-display text-xl font-semibold text-brand-text-light mb-4">{category.name}</h3>
                            <ul className="list-disc list-inside space-y-2 text-base font-medium">
                                {category.items.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </div>
                    </AnimatedItem>
                ))}
            </div>
          </Section>

          {/* Languages */}
          <Section title="Languages" icon={<GlobeIcon />}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cvData.languages.map((lang, index) => (
                      <AnimatedItem key={lang.name} delay={index * 100}>
                          <div className="bg-brand-dark border border-brand-border p-6 rounded-xl text-center">
                              <h3 className="font-display text-xl font-semibold text-brand-text-light">{lang.name}</h3>
                              <p className="text-sm text-brand-text-dark mt-1">{lang.level}</p>
                          </div>
                      </AnimatedItem>
                  ))}
              </div>
          </Section>

          {/* Working Style */}
          {cvData.workingStyle.length > 0 && (
          <Section title="Working Style" icon={<UserIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cvData.workingStyle.map((item, index) => {
                      const [title, ...rest] = item.split(': ');
                      const description = rest.join(': ');
                      return (
                          <AnimatedItem key={index} delay={index * 100}>
                              <div className="bg-brand-dark border border-brand-border p-6 rounded-xl h-full">
                                  <h3 className="font-display text-lg font-semibold text-brand-text-light mb-2">{title}</h3>
                                  <p className="text-base font-medium">{description}</p>
                              </div>
                          </AnimatedItem>
                      );
                  })}
              </div>
          </Section>
          )}

          {/* Continuous Learning */}
          <Section title="Continuous Learning" icon={<BookIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(
                      cvData.books.reduce((acc, book) => {
                          if (!acc[book.category]) acc[book.category] = [];
                          acc[book.category].push(book);
                          return acc;
                      }, {} as Record<string, typeof cvData.books>)
                  ).map(([category, books], index) => (
                      <AnimatedItem key={category} delay={index * 100}>
                          <div className="bg-brand-dark border border-brand-border p-6 rounded-xl h-full">
                              <h3 className="font-display text-xl font-semibold text-brand-text-light mb-4">{category}</h3>
                              <ul className="space-y-3">
                                  {books.map(book => (
                                      <li key={book.title} className="text-base font-medium">
                                          <span className="text-brand-text-light">{book.title}</span>
                                          <span className="text-brand-text-dark text-sm block">{book.author}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </AnimatedItem>
                  ))}
              </div>
          </Section>

          {/* Contact */}
          <Section title="Contact" icon={<PaperPlaneIcon />} className="pb-0">
            <AnimatedItem>
                <h3 className="font-display text-4xl font-bold text-brand-text-light mb-8">Let's Get in Touch!</h3>
            </AnimatedItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <AnimatedItem delay={100}>
                        <div className="bg-brand-dark border border-brand-border p-6 rounded-lg flex items-center gap-4">
                            <PhoneIcon className="w-8 h-8 text-brand-green flex-shrink-0" />
                            <div>
                                <p className="text-sm text-brand-text-dark">Contact No (Whatsapp)</p>
                                <a href={`tel:${cvData.phone}`} className="text-lg text-brand-text-light hover:text-brand-green">{cvData.phone}</a>
                            </div>
                        </div>
                    </AnimatedItem>
                    <AnimatedItem delay={200}>
                        <div className="bg-brand-dark border border-brand-border p-6 rounded-lg flex items-center gap-4">
                            <MailIcon className="w-8 h-8 text-brand-green flex-shrink-0" />
                            <div>
                                <p className="text-sm text-brand-text-dark">Email</p>
                                <a href={`mailto:${cvData.email}`} className="text-lg text-brand-text-light hover:text-brand-green">{cvData.email}</a>
                            </div>
                        </div>
                    </AnimatedItem>
                    <AnimatedItem delay={300}>
                        <div className="bg-brand-dark border border-brand-border p-6 rounded-lg flex items-center gap-4">
                            <MapPinIcon className="w-8 h-8 text-brand-green flex-shrink-0" />
                            <div>
                                <p className="text-sm text-brand-text-dark">Address</p>
                                <p className="text-lg text-brand-text-light">{cvData.address}</p>
                            </div>
                        </div>
                    </AnimatedItem>
                </div>
                <AnimatedItem delay={400}>
                    <ContactForm />
                </AnimatedItem>
            </div>
          </Section>

        </main>
      </div>
    </div>
  );
};

export default App;
