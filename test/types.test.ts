import { describe, it, expect } from 'vitest';
import type { CVData, SocialLink, Stat, SkillCategory, Experience, Education } from '../types';

describe('TypeScript Interfaces', () => {
  it('CVData interface accepts valid data', () => {
    const mockIcon = () => null;
    const data: CVData = {
      name: 'Test Name',
      title: 'Test Title',
      location: 'Test Location',
      email: 'test@example.com',
      phone: '+1234567890',
      address: '123 Test St',
      profilePictureUrl: '/test.jpg',
      socials: [],
      profile: 'Test profile text',
      stats: [],
      skills: [],
      experience: [],
      education: [],
    };
    expect(data.name).toBe('Test Name');
    expect(data.email).toBe('test@example.com');
    expect(data.socials).toEqual([]);
  });

  it('SocialLink interface accepts valid data', () => {
    const mockIcon = () => null;
    const link: SocialLink = {
      name: 'GitHub',
      url: 'https://github.com/test',
      icon: mockIcon,
    };
    expect(link.name).toBe('GitHub');
    expect(link.url).toBe('https://github.com/test');
    expect(typeof link.icon).toBe('function');
  });

  it('Stat interface accepts valid data', () => {
    const stat: Stat = {
      value: '10+',
      label: 'Projects',
    };
    expect(stat.value).toBe('10+');
    expect(stat.label).toBe('Projects');
  });

  it('SkillCategory interface accepts valid data', () => {
    const category: SkillCategory = {
      name: 'Technical',
      items: ['JavaScript', 'TypeScript', 'React'],
    };
    expect(category.name).toBe('Technical');
    expect(category.items).toHaveLength(3);
    expect(category.items).toContain('React');
  });

  it('Experience interface accepts valid data', () => {
    const exp: Experience = {
      company: 'Test Corp',
      role: 'Developer',
      period: '2020 - Present',
      location: 'Remote',
      description: ['Built things', 'Fixed things'],
      icon: '🏢',
    };
    expect(exp.company).toBe('Test Corp');
    expect(exp.description).toHaveLength(2);
    expect(exp.icon).toBe('🏢');
  });

  it('Education interface accepts valid data', () => {
    const edu: Education = {
      degree: 'CS Degree',
      institution: 'Test University',
      period: '2018 - 2022',
    };
    expect(edu.degree).toBe('CS Degree');
    expect(edu.institution).toBe('Test University');
    expect(edu.details).toBeUndefined();
  });

  it('Education interface accepts optional details field', () => {
    const edu: Education = {
      degree: 'CS Degree',
      institution: 'Test University',
      period: '2018 - 2022',
      details: 'GPA: 3.9',
    };
    expect(edu.details).toBe('GPA: 3.9');
  });

  it('CVData can hold complete data with all nested types', () => {
    const mockIcon = () => null;
    const fullData: CVData = {
      name: 'Full Test',
      title: 'Full Title',
      location: 'Full Location',
      email: 'full@test.com',
      phone: '+0000000000',
      address: '456 Full St',
      profilePictureUrl: '/full.jpg',
      socials: [{ name: 'GitHub', url: 'https://github.com', icon: mockIcon }],
      profile: 'Full profile',
      stats: [{ value: '5+', label: 'Years' }],
      skills: [{ name: 'Dev', items: ['JS'] }],
      experience: [
        {
          company: 'Co',
          role: 'Dev',
          period: '2020',
          location: 'Remote',
          description: ['Did stuff'],
          icon: '💻',
        },
      ],
      education: [
        { degree: 'BS', institution: 'Uni', period: '2020' },
      ],
    };
    expect(fullData.socials).toHaveLength(1);
    expect(fullData.stats).toHaveLength(1);
    expect(fullData.skills).toHaveLength(1);
    expect(fullData.experience).toHaveLength(1);
    expect(fullData.education).toHaveLength(1);
  });
});
