import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mock',
    height: 2000,
    width: 1000,
  }),
}));

// Mock jsPDF
vi.mock('jspdf', () => {
  class MockJsPDF {
    setFillColor = vi.fn();
    rect = vi.fn();
    addImage = vi.fn();
    addPage = vi.fn();
    save = vi.fn();
  }
  return { default: MockJsPDF };
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    // Immediately trigger callback with isIntersecting: true so elements become visible
    setTimeout(() => {
      callback(
        [{ isIntersecting: true, target: document.createElement('div') } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      );
    }, 0);
  }
}
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the CV owner name', () => {
    render(<App />);
    const nameElements = screen.getAllByText('Kabir Hasenbalg');
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the profile description', () => {
    render(<App />);
    expect(screen.getByText(/Entrepreneur, product architect/)).toBeInTheDocument();
  });

  it('renders social links for GitHub, Twitter, and Instagram', () => {
    render(<App />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
  });

  it('renders stat cards with correct values', () => {
    render(<App />);
    expect(screen.getByText('8+')).toBeInTheDocument();
    expect(screen.getByText('Years of Experience')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
    expect(screen.getByText('Completed Projects')).toBeInTheDocument();
    expect(screen.getByText('10+')).toBeInTheDocument();
    expect(screen.getByText('Happy Clients')).toBeInTheDocument();
    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Technologies Mastered')).toBeInTheDocument();
  });

  it('renders the Experience section with all companies', () => {
    render(<App />);
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('DJElite')).toBeInTheDocument();
    expect(screen.getByText('Hasen Marketing Agency')).toBeInTheDocument();
    expect(screen.getByText('On The Ground Sound')).toBeInTheDocument();
  });

  it('renders experience roles', () => {
    render(<App />);
    expect(screen.getByText('Founder & Head of Product')).toBeInTheDocument();
    expect(screen.getByText('Founder & CEO')).toBeInTheDocument();
    expect(screen.getByText('Head of Marketing')).toBeInTheDocument();
  });

  it('renders the Education section with all entries', () => {
    render(<App />);
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('CS50: Intro to Computer Science')).toBeInTheDocument();
    expect(screen.getByText('Harvard University')).toBeInTheDocument();
    expect(screen.getByText('Python Certification')).toBeInTheDocument();
    expect(screen.getByText('Design in Image and Sound')).toBeInTheDocument();
    expect(screen.getByText('Music Production')).toBeInTheDocument();
  });

  it('renders the Core Skills section with all categories', () => {
    render(<App />);
    expect(screen.getByText('Core Skills')).toBeInTheDocument();
    expect(screen.getByText('Technical / Analytical')).toBeInTheDocument();
    expect(screen.getByText('Business & Strategic')).toBeInTheDocument();
    expect(screen.getByText('Creative & Design')).toBeInTheDocument();
  });

  it('renders the Contact section with contact info', () => {
    render(<App />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText("Let's Get in Touch!")).toBeInTheDocument();
    expect(screen.getByText('kabirhasen@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+55 21 999340899')).toBeInTheDocument();
    expect(screen.getByText('Buenos Aires, Argentina')).toBeInTheDocument();
  });

  it('renders the contact form with all fields', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
    expect(screen.getByText('Send Message')).toBeInTheDocument();
  });

  it('renders the Download CV button', () => {
    render(<App />);
    expect(screen.getByText('Download CV')).toBeInTheDocument();
  });

  it('renders the Contact Me link with correct mailto', () => {
    render(<App />);
    const contactMeLinks = screen.getAllByText('Contact Me');
    const mailtoLink = contactMeLinks.find(
      (el) => el.closest('a')?.getAttribute('href') === 'mailto:kabirhasen@gmail.com'
    );
    expect(mailtoLink).toBeDefined();
  });

  it('renders the Available for work badge', () => {
    render(<App />);
    expect(screen.getByText('Available for work')).toBeInTheDocument();
  });

  it('renders the profile image with correct alt text', () => {
    render(<App />);
    const img = screen.getByAltText('Kabir Hasenbalg');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/ka-profile.jpg');
  });

  it('renders experience description points', () => {
    render(<App />);
    expect(
      screen.getByText(/Founded a global platform connecting DJs/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Built a marketing and data consulting agency/)
    ).toBeInTheDocument();
  });

  it('renders skill items inside categories', () => {
    render(<App />);
    expect(screen.getByText(/Supabase, Neon.tech, PostgreSQL/)).toBeInTheDocument();
    expect(screen.getByText(/Product Strategy & Ecosystem Design/)).toBeInTheDocument();
    expect(screen.getByText(/Branding, UX & UI Design/)).toBeInTheDocument();
  });
});

describe('Download PDF', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  it('calls downloadPDF when Download CV button is clicked', async () => {
    const html2canvas = (await import('html2canvas')).default;
    render(<App />);
    const downloadBtn = screen.getByText('Download CV').closest('button')!;
    fireEvent.click(downloadBtn);
    await waitFor(() => {
      expect(html2canvas).toHaveBeenCalled();
    });
  });
});

describe('Contact Form Submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the contact form and shows success alert on OK response', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(<App />);

    await user.type(screen.getByPlaceholderText('Full Name'), 'Test User');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Hello!');

    const submitBtn = screen.getByText('Send Message').closest('button')!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Message sent successfully!');
    });

    alertMock.mockRestore();
  });

  it('shows fallback alert when fetch fails', async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<App />);

    await user.type(screen.getByPlaceholderText('Full Name'), 'Test User');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Message'), 'Hello!');

    const submitBtn = screen.getByText('Send Message').closest('button')!;
    await user.click(submitBtn);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Message saved locally!');
    });

    alertMock.mockRestore();
  });
});
