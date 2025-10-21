import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { CVData, Experience, Education, SocialLink, Stat } from './types';

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

// --- DATA ---
const cvData: CVData = {
  name: "Kabir Hasenbalg",
  title: "Founder | Product Architect | Data & Web Systems Specialist",
  location: "Buenos Aires, Argentina",
  email: "kabirhasen@gmail.com",
  phone: "+55 21 999340899",
  address: "Buenos Aires, Argentina",
  profilePictureUrl: "./ka profile.jpg",
  socials: [
    { name: "GitHub", url: "https://github.com/kabir-hasenbalg", icon: GithubIcon },
    { name: "Twitter", url: "https://x.com/", icon: TwitterIcon },
    { name: "Instagram", url: "https://instagram.com/kabirhasenm", icon: InstagramIcon },
  ],
  profile: "Entrepreneur, product architect, and data systems specialist with extensive experience in web development, database architecture, and automation. Founder of DJElite and Hasen Marketing Agency, with a track record of building data-driven platforms and creative-technical ecosystems that scale.",
  stats: [
      { value: "8+", label: "Years of Experience" },
      { value: "15+", label: "Completed Projects" },
      { value: "10+", label: "Happy Clients" },
      { value: "5+", label: "Technologies Mastered" },
  ],
  skills: [
    { name: "Technical / Analytical", items: ["Supabase, Neon.tech, PostgreSQL", "SQL & Data Modeling", "Python (Data Analysis, Automation)", "API Integrations (OAuth, Stripe, Ably)", "Netlify, Vercel Deployment", "Zapier, Notion API, Airtable", "HTML, CSS, JavaScript", "Looker Studio Dashboards", "Git/GitHub Version Control"] },
    { name: "Business & Strategic", items: ["Product Strategy & Ecosystem Design", "Growth Strategy & Analytics", "Marketing Automation", "Stakeholder Communication", "Agile / Scrum Methodology"] },
    { name: "Creative & Design", items: ["Branding, UX & UI Design", "Audiovisual Production", "AI-Assisted Content Systems"] }
  ],
  experience: [
    { company: "DJElite", role: "Founder & Head of Product", period: "2023 - Present", location: "Amsterdam, Netherlands", description: ["Founded a global platform connecting DJs, promoters, and event organizers through data-driven tools.", "Designed and managed full product ecosystem: web architecture, databases, and UX.", "Built front-end environments on Netlify/Vercel, integrated OAuth, Stripe, and backend tools.", "Created AI-driven workflows for content automation, email campaigns, and audience analytics."], icon: "🏢" },
    { company: "Hasen Marketing Agency", role: "Founder & CEO", period: "2019 - 2025", location: "Barcelona, Spain", description: ["Built a marketing and data consulting agency delivering ROI-driven campaigns.", "Developed automated marketing pipelines, dashboards, and analytics systems.", "Managed client strategy, campaign execution, and business scaling."], icon: "🚀" },
    { company: "On The Ground Sound", role: "Head of Marketing", period: "2019 - 2024", location: "Netherlands", description: ["Led marketing and communications strategy for a global music platform.", "Developed campaigns, managed social media, PR, and media relations."], icon: "🎵" },
  ],
  education: [
    { degree: "CS50: Intro to Computer Science", institution: "Harvard University", period: "Certificate" },
    { degree: "Python Certification", institution: "Universidad de Buenos Aires", period: "2014, 2015" },
    { degree: "Design in Image and Sound", institution: "University of Buenos Aires (FADU)", period: "Ongoing" },
    { degree: "Music Production", institution: "Berklee College of Music", period: "2015" },
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

  const downloadPDF = async () => {
    if (!cvRef.current) return;
    
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const canvas = await html2canvas(cvRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#0a0a0a'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.setFillColor(10, 10, 10);
    pdf.rect(0, 0, 210, 297, 'F');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, 210, 297, 'F');
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
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