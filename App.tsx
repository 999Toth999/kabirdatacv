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

// --- DATA ---
const cvData: CVData = {
  name: "Kabir Hasenbalg",
  title: "AI Enablement Builder | Supabase & Automation Architect | Content × Tech",
  location: "Buenos Aires, Argentina",
  email: "kabirhasen@gmail.com",
  phone: "+54 91168143855",
  address: "Buenos Aires, Argentina",
  profilePictureUrl: "/ka-profile.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com/kabir-hasenbalg", icon: GithubIcon },
    { name: "LinkedIn", url: "https://linkedin.com/in/kabirhasenbalg", icon: LinkedInIcon },
    { name: "Twitter", url: "https://x.com/", icon: TwitterIcon },
    { name: "Instagram", url: "https://instagram.com/kabirhasenm", icon: InstagramIcon },
  ],
  profile: "Strategic digital marketer and product builder with 6+ years of experience building B2C brands and Supabase-powered platforms from the ground up. Grew On The Ground Sound from dozens to 3,000+ users organically with zero ad spend through integrated content, email, and community funnels. Now specializing in AI enablement, workflow automation (N8N, Hermes Agent), and full-stack development. Operates autonomously with a founder's mindset — focused on ownership, strategy, and shipping end-to-end.",
  stats: [
      { value: "3K+", label: "Users Grown Organically" },
      { value: "6+", label: "Years of Experience" },
      { value: "$0", label: "Ad Spend for 6,000% Growth" },
      { value: "4", label: "Languages Spoken" },
  ],
  skills: [
    { name: "AI & Technical", items: ["Supabase (Auth, Realtime, Edge Functions, Storage)", "Claude Code & AI Coding Assistants (Amazon Q, Kiro-CLI, Codebuff)", "Hermes Agent (Custom Skills & Email Marketing Automation)", "N8N Workflow Automation", "Telegram Bot Development & REST API Integration", "PostgreSQL, Neon.tech, SQL & Data Modeling", "React, TypeScript, JavaScript", "Python (Data Analysis, Automation, Bots)", "API Integrations (OAuth, Stripe, Ably)", "Netlify, Vercel Deployment", "Zapier, Notion API, Airtable", "Git/GitHub Version Control"] },
    { name: "Digital Marketing", items: ["End-to-End Funnel Design (Attention → Trust → Conversion)", "Meta Ads Campaign Strategy & Audience Targeting", "Email Marketing, Sequences & Automation", "Organic Social Media Growth (Instagram, LinkedIn, Facebook, X, YouTube)", "Copywriting: Human, Non-Corporate, Psychology-Driven", "CRM & Marketing Automation Pipelines", "Analytics & Performance Optimization"] },
    { name: "Content Production", items: ["Video Production & Editing (Adobe Premiere, After Effects)", "Studio Photography & Lighting", "Graphic Design (Photoshop, Canva)", "Documentary Production", "AI-Assisted Content Systems (Claude, GPT)"] },
    { name: "Business & Strategy", items: ["Product Strategy & Ecosystem Design", "Community Building & Growth", "Brand Positioning & Go-to-Market", "Stakeholder Communication", "Rapid Niche Adoption (Music, Fashion, AI Medical, Travel)"] }
  ],
  experience: [
    { company: "DJElite", role: "Founder & Head of Product", period: "2023 - 2025", location: "Amsterdam, Netherlands", description: ["Founded a global platform connecting DJs, promoters, and event organizers — full ownership from architecture to launch.", "Built on Supabase (Auth, Realtime, PostgreSQL) with React front-end deployed on Netlify/Vercel.", "Integrated OAuth, Stripe payments, and Ably for real-time features.", "Developed AI-driven workflows using Claude Code and automation tools for content, email campaigns, and analytics.", "Built Telegram bots connecting as proxy to Kiro-CLI via local REST API for automated task workflows.", "Automated repetitive email marketing tasks using Hermes Agent with custom-built skills."], icon: "🏢" },
    { company: "Hasen Marketing Agency", role: "Founder & CEO", period: "2022 - 2025", location: "Barcelona, Spain", description: ["Managed multi-platform social media presence (LinkedIn, Instagram, X, YouTube, Facebook) for clients including OTGS.io.", "Developed Meta Ads strategies for B2C clients including 2dayMind (AI medical company), designing audience targeting and campaign structure.", "Currently managing a 9,000+ follower Instagram account for a local Indian culture brand.", "Produced video advertisements for Barcelona fashion brands including The Loft Studios.", "Built automated content posting workflows and social media scheduling systems.", "Currently managing a Meta Ads campaign for a small travel tours business."], icon: "🚀" },
    { company: "On The Ground Sound", role: "Head of Marketing & Content", period: "2019 - 2024", location: "Amersfoort, Netherlands", description: ["Scaled user base from ~50 to 3,000+ members (6,000% growth) through strategic organic social media, email sequences, and community building — with zero paid advertising.", "Managed complete social media ecosystem (Instagram, Facebook, LinkedIn) with content strategy designed to move users through awareness → trust → signup funnel.", "Built and executed email marketing campaigns and automated sequences that converted interest into active platform members.", "Created all visual content: promotional videos, DJ mix videos, flyers, and graphics using Canva, Photoshop, and After Effects.", "Drove community growth through direct outreach on SoundCloud — messaging artists, commenting on tracks, and onboarding users to the platform.", "Business development: pitched clubs, venues, and event organizers to adopt the platform for music events.", "Influencer outreach: connected with established DJs to increase platform visibility and engagement."], icon: "🎵" },
    { company: "The Loft Studios", role: "Video, Photography & Lighting Editor", period: "2020 - 2022", location: "Barcelona, Spain", description: ["Edited and color-graded video content for brand campaigns and social media advertising.", "Managed photography shoots including composition, lighting design, and post-production editing.", "Collaborated with creative teams to produce high-quality visual content optimized for digital platforms."], icon: "📸" },
    { company: "Intentional Ibiza", role: "Documentary Producer", period: "2019", location: "Ibiza, Spain", description: ["Produced and directed a documentary project capturing the cultural and creative scene in Ibiza."], icon: "🎬" },
  ],
  education: [
    { degree: "CS50: Intro to Computer Science", institution: "Harvard University", period: "Ongoing" },
    { degree: "Python Certification", institution: "Universidad de Buenos Aires", period: "2014, 2015" },
    { degree: "Design in Image and Sound", institution: "University of Buenos Aires (FADU)", period: "2014 - 2015" },
    { degree: "Music Production", institution: "Berklee College of Music (Coursera)", period: "2015" },
    { degree: "Social Media Marketing (SMMA)", institution: "Self-directed Study", period: "2019 - 2020" },
  ],
  languages: [
    { name: "Spanish", level: "Native" },
    { name: "English", level: "Native" },
    { name: "Portuguese", level: "Professional" },
    { name: "Italian", level: "Professional" },
  ],
  workingStyle: [
    "Autonomous Operator: Comfortable taking full ownership as first or solo marketer; experienced setting own deadlines and maintaining accountability.",
    "Rapid Niche Adoption: Proven ability to learn new industries fast (music, fashion, AI medical, Indian culture, travel) and quickly adapt language, positioning, and customer psychology.",
    "Funnel-First Thinking: Designs marketing around complete customer journeys (attention → trust → conversion), not isolated tactics or channels.",
    "Anti-Corporate Communication: Intentionally writes human, clear copy that builds trust; actively avoids buzzwords and corporate jargon.",
    "Outcome-Focused: Aligns all marketing activities with real business results (bookings, sales, revenue), not just clicks or impressions.",
    "AI-Native Workflow: Integrates AI tools (Claude Code, Hermes Agent, N8N) into daily workflows for automation, content, and development.",
  ],
  books: [
    { title: "Pitch Anything", author: "Oren Klaff", category: "Business & Strategy" },
    { title: "Blue Ocean Strategy", author: "W. Chan Kim", category: "Business & Strategy" },
    { title: "The 4-Hour Work Week", author: "Tim Ferriss", category: "Business & Strategy" },
    { title: "The Psychology of Selling", author: "Brian Tracy", category: "Business & Strategy" },
    { title: "Think and Grow Rich", author: "Napoleon Hill", category: "Business & Strategy" },
    { title: "7 Habits of Highly Effective People", author: "Stephen Covey", category: "Leadership & Growth" },
    { title: "How to Win Friends and Influence People", author: "Dale Carnegie", category: "Leadership & Growth" },
    { title: "Awaken the Giant Within", author: "Tony Robbins", category: "Leadership & Growth" },
    { title: "The Art of War", author: "Sun Tzu", category: "Leadership & Growth" },
    { title: "The Psychology of Money", author: "Morgan Housel", category: "Mindset" },
    { title: "The Subtle Art of Not Giving a F***", author: "Mark Manson", category: "Mindset" },
    { title: "Man's Search for Meaning", author: "Viktor Frankl", category: "Mindset" },
  ],
};

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
                  <p className="text-base">{item.company}</p>
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
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                alert('Message sent successfully!');
                e.currentTarget.reset();
            }
        } catch (error) {
            alert('Message saved locally!');
            console.log('Contact form data:', data);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
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

  const downloadPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = 210;
    const pageH = 297;
    const margin = 15;
    const contentW = pageW - margin * 2;
    let y = margin;

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

    const checkPage = (needed: number) => {
      if (y + needed > pageH - margin) { pdf.addPage(); fillPage(); y = margin; }
    };

    const drawCard = (x: number, w: number, h: number) => {
      pdf.setFillColor(...dark); pdf.roundedRect(x, y, w, h, 2, 2, 'F');
      pdf.setDrawColor(...border); pdf.roundedRect(x, y, w, h, 2, 2, 'S');
    };

    const sectionTitle = (title: string) => {
      checkPage(14);
      pdf.setFillColor(...green); pdf.rect(margin, y, 3, 8, 'F');
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16); pdf.setTextColor(...white);
      pdf.text(title, margin + 7, y + 6);
      y += 14;
    };

    // ===== HEADER =====
    pdf.setFillColor(...dark); pdf.roundedRect(margin, y, contentW, 38, 3, 3, 'F');
    pdf.setDrawColor(...border); pdf.roundedRect(margin, y, contentW, 38, 3, 3, 'S');
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22); pdf.setTextColor(...white);
    pdf.text(cvData.name, margin + 6, y + 12);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(10); pdf.setTextColor(...green);
    pdf.text(sanitize(cvData.title), margin + 6, y + 20);
    pdf.setFontSize(9); pdf.setTextColor(...muted);
    pdf.text(`${cvData.email}  |  ${cvData.phone}  |  ${cvData.location}`, margin + 6, y + 28);
    const linkedIn = cvData.socials.find(s => s.name === 'LinkedIn');
    const github = cvData.socials.find(s => s.name === 'GitHub');
    const linksText = [linkedIn && linkedIn.url, github && github.url].filter(Boolean).join('  |  ');
    if (linksText) { pdf.text(linksText, margin + 6, y + 34); }
    y += 44;

    // ===== PROFILE =====
    sectionTitle('Profile');
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...muted);
    const profileLines = pdf.splitTextToSize(sanitize(cvData.profile), contentW - 4);
    checkPage(profileLines.length * 4 + 4);
    pdf.text(profileLines, margin + 2, y);
    y += profileLines.length * 4 + 6;

    // ===== STATS =====
    const statW = (contentW - 9) / 4;
    checkPage(18);
    cvData.stats.forEach((stat, i) => {
      const sx = margin + i * (statW + 3);
      drawCard(sx, statW, 14);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(14); pdf.setTextColor(...green);
      pdf.text(stat.value, sx + statW / 2, y + 7, { align: 'center' });
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7); pdf.setTextColor(...muted);
      pdf.text(stat.label, sx + statW / 2, y + 12, { align: 'center' });
    });
    y += 20;

    // ===== EXPERIENCE =====
    sectionTitle('Experience');
    cvData.experience.forEach(exp => {
      const bullets = exp.description;
      const bulletLines = bullets.map(b => pdf.splitTextToSize(sanitize(`• ${b}`), contentW - 14));
      const totalLines = bulletLines.reduce((sum, lines) => sum + lines.length, 0);
      const cardH = 18 + totalLines * 3.8;
      checkPage(cardH + 4);
      drawCard(margin, contentW, cardH);
      const cx = margin + 6;
      let cy = y + 6;
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11); pdf.setTextColor(...white);
      pdf.text(exp.role, cx, cy);
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...green);
      pdf.text(exp.company, cx, cy + 5);
      pdf.setTextColor(...muted); pdf.setFontSize(8);
      pdf.text(`${exp.period}  •  ${exp.location}`, cx, cy + 10);
      cy += 15;
      pdf.setTextColor(...muted); pdf.setFontSize(8);
      bulletLines.forEach(lines => {
        pdf.text(lines, cx, cy);
        cy += lines.length * 3.8;
      });
      y += cardH + 4;
    });

    // ===== EDUCATION =====
    sectionTitle('Education');
    const eduColW = (contentW - 4) / 2;
    for (let i = 0; i < cvData.education.length; i += 2) {
      checkPage(18);
      for (let j = 0; j < 2; j++) {
        const edu = cvData.education[i + j];
        if (!edu) break;
        const ex = margin + j * (eduColW + 4);
        drawCard(ex, eduColW, 14);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
        pdf.text(edu.degree, ex + 4, y + 5, { maxWidth: eduColW - 28 });
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
        pdf.text(edu.institution, ex + 4, y + 10);
        pdf.setFontSize(7); pdf.setTextColor(...green);
        pdf.text(edu.period, ex + eduColW - 4, y + 5, { align: 'right' });
      }
      y += 18;
    }

    // ===== CORE SKILLS =====
    sectionTitle('Core Skills');
    const skillColW = (contentW - 4) / 2;
    for (let i = 0; i < cvData.skills.length; i += 2) {
      const heights = [0, 0];
      for (let j = 0; j < 2; j++) {
        const cat = cvData.skills[i + j];
        if (!cat) break;
        heights[j] = 10 + cat.items.length * 4;
      }
      const rowH = Math.max(heights[0], heights[1]);
      checkPage(rowH + 4);
      for (let j = 0; j < 2; j++) {
        const cat = cvData.skills[i + j];
        if (!cat) break;
        const sx = margin + j * (skillColW + 4);
        drawCard(sx, skillColW, rowH);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...white);
        pdf.text(cat.name, sx + 4, y + 6);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(...muted);
        cat.items.forEach((item, idx) => {
          pdf.text(sanitize(`• ${item}`), sx + 4, y + 12 + idx * 4, { maxWidth: skillColW - 8 });
        });
      }
      y += rowH + 4;
    }

    // ===== LANGUAGES =====
    sectionTitle('Languages');
    const langW = (contentW - 9) / 4;
    checkPage(18);
    cvData.languages.forEach((lang, i) => {
      const lx = margin + i * (langW + 3);
      drawCard(lx, langW, 14);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(10); pdf.setTextColor(...white);
      pdf.text(lang.name, lx + langW / 2, y + 6, { align: 'center' });
      pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...muted);
      pdf.text(lang.level, lx + langW / 2, y + 11, { align: 'center' });
    });
    y += 20;

    // ===== WORKING STYLE =====
    sectionTitle('Working Style');
    const wsColW = (contentW - 4) / 2;
    for (let i = 0; i < cvData.workingStyle.length; i += 2) {
      const heights = [0, 0];
      for (let j = 0; j < 2; j++) {
        const item = cvData.workingStyle[i + j];
        if (!item) break;
        const [, ...rest] = item.split(': ');
        const desc = sanitize(rest.join(': '));
        const descLines = pdf.splitTextToSize(desc, wsColW - 8);
        heights[j] = 12 + descLines.length * 3.5;
      }
      const rowH = Math.max(heights[0], heights[1]);
      checkPage(rowH + 4);
      for (let j = 0; j < 2; j++) {
        const item = cvData.workingStyle[i + j];
        if (!item) break;
        const [title, ...rest] = item.split(': ');
        const desc = sanitize(rest.join(': '));
        const wx = margin + j * (wsColW + 4);
        drawCard(wx, wsColW, rowH);
        pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
        pdf.text(title, wx + 4, y + 6);
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7.5); pdf.setTextColor(...muted);
        const descLines = pdf.splitTextToSize(desc, wsColW - 8);
        pdf.text(descLines, wx + 4, y + 11);
      }
      y += rowH + 4;
    }

    // ===== CONTINUOUS LEARNING =====
    sectionTitle('Continuous Learning');
    const bookCategories = cvData.books.reduce((acc, book) => {
      if (!acc[book.category]) acc[book.category] = [];
      acc[book.category].push(book);
      return acc;
    }, {} as Record<string, typeof cvData.books>);
    const catEntries = Object.entries(bookCategories);
    const bookColW = (contentW - (catEntries.length - 1) * 3) / catEntries.length;
    const maxBooks = Math.max(...catEntries.map(([, b]) => b.length));
    const bookCardH = 10 + maxBooks * 7;
    checkPage(bookCardH + 4);
    catEntries.forEach(([category, books], i) => {
      const bx = margin + i * (bookColW + 3);
      drawCard(bx, bookColW, bookCardH);
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9); pdf.setTextColor(...white);
      pdf.text(category, bx + 4, y + 6);
      books.forEach((book, idx) => {
        pdf.setFont('helvetica', 'normal'); pdf.setFontSize(8); pdf.setTextColor(...white);
        pdf.text(book.title, bx + 4, y + 13 + idx * 7, { maxWidth: bookColW - 8 });
        pdf.setFontSize(7); pdf.setTextColor(...muted);
        pdf.text(book.author, bx + 4, y + 16 + idx * 7, { maxWidth: bookColW - 8 });
      });
    });
    y += bookCardH + 6;

    // ===== CONTACT =====
    sectionTitle('Contact');
    checkPage(12);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9); pdf.setTextColor(...muted);
    pdf.text(`Phone: ${cvData.phone}    |    Email: ${cvData.email}    |    ${cvData.address}`, margin + 2, y);
    y += 8;

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
                            <p className="text-5xl font-display font-bold text-brand-green">{stat.value}</p>
                            <p className="text-sm mt-1">{stat.label}</p>
                        </div>
                    </AnimatedItem>
                ))}
            </div>
          </section>

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
