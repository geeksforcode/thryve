export interface Profile {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  skills: string[];
  experience: string;
  hourlyRate: string;
  description: string;
  bio: string;
  email: string;
  phone: string;
  portfolio?: Array<{
    title: string;
    description: string;
    image: string;
    tags: string[];
  }>;
  workHistory: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
    instagram?: string;
  };
  isActive: boolean;
}

export const profiles: Profile[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    role: 'Full Stack Developer & UI/UX Designer',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 47,
    skills: ['React', 'Node.js', 'TypeScript', 'Figma', 'AWS'],
    experience: '5+ years',
    hourlyRate: '$85/hr',
    description: 'Passionate full-stack developer with expertise in modern web technologies and user experience design.',
    bio: 'I\'m a passionate full-stack developer with over 5 years of experience creating digital solutions that blend beautiful design with robust functionality. My journey began with a Computer Science degree from Stanford, and I\'ve since worked with startups and Fortune 500 companies to bring innovative ideas to life.',
    email: 'sarah@sarahchen.dev',
    phone: '+1 (555) 123-4567',
    portfolio: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe']
      }
    ],
    workHistory: [
      {
        company: 'TechFlow Solutions',
        role: 'Senior Full Stack Developer',
        duration: '2022 - Present',
        description: 'Lead development of customer-facing web applications using React and Node.js. Collaborate with design teams to implement pixel-perfect UI/UX.'
      },
      {
        company: 'StartupXYZ',
        role: 'Frontend Developer',
        duration: '2020 - 2022',
        description: 'Built responsive web applications from scratch. Implemented modern design systems and improved application performance by 40%.'
      }
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'B.S. Computer Science',
        year: '2020'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      github: 'https://github.com/sarahchen',
      website: 'https://sarahchen.dev'
    },
    isActive: true
  },
  {
    id: 'alex-rodriguez',
    name: 'Alex Rodriguez',
    role: 'Backend Developer & DevOps Engineer',
    location: 'Austin, TX',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    reviews: 32,
    skills: ['Python', 'Django', 'Docker', 'Kubernetes', 'PostgreSQL'],
    experience: '7+ years',
    hourlyRate: '$90/hr',
    description: 'Senior backend developer specializing in scalable architectures and cloud infrastructure.',
    bio: 'With over 7 years of experience in backend development and DevOps, I specialize in building scalable, high-performance systems. I\'m passionate about clean code, automated testing, and creating robust infrastructure that can handle millions of users.',
    email: 'alex@alexrodriguez.dev',
    phone: '+1 (555) 234-5678',
    workHistory: [
      {
        company: 'CloudTech Corp',
        role: 'Senior Backend Engineer',
        duration: '2021 - Present',
        description: 'Architected microservices handling 10M+ daily requests. Implemented CI/CD pipelines reducing deployment time by 60%.'
      }
    ],
    education: [
      {
        school: 'University of Texas at Austin',
        degree: 'M.S. Computer Science',
        year: '2018'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexrodriguez',
      github: 'https://github.com/alexrodriguez'
    },
    isActive: true
  },
  {
    id: 'mike-thompson',
    name: 'Mike Thompson',
    role: 'Licensed Electrician',
    location: 'Phoenix, AZ',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    reviews: 64,
    skills: ['Residential Wiring', 'Commercial Electrical', 'Panel Installation', 'Code Compliance', 'Troubleshooting'],
    experience: '12+ years',
    hourlyRate: '$65/hr',
    description: 'Master electrician with extensive experience in residential and commercial electrical systems.',
    bio: 'I\'ve been working as a licensed electrician for over 12 years, specializing in both residential and commercial electrical systems. I take pride in delivering safe, code-compliant work and excellent customer service.',
    email: 'mike@mikethompsonelectric.com',
    phone: '+1 (555) 345-6789',
    workHistory: [
      {
        company: 'Thompson Electrical Services',
        role: 'Master Electrician & Owner',
        duration: '2018 - Present',
        description: 'Founded and operate electrical contracting business. Manage team of 5 electricians and handle complex commercial projects.'
      }
    ],
    education: [
      {
        school: 'Arizona State Technical College',
        degree: 'Electrical Technology Certificate',
        year: '2012'
      }
    ],
    socialLinks: {
      website: 'https://mikethompsonelectric.com'
    },
    isActive: true
  },
  {
    id: 'carlos-rivera',
    name: 'Carlos Rivera',
    role: 'Professional Plumber',
    location: 'Houston, TX',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    reviews: 89,
    skills: ['Pipe Installation', 'Drain Cleaning', 'Water Heater Repair', 'Leak Detection', 'Bathroom Remodeling'],
    experience: '15+ years',
    hourlyRate: '$55/hr',
    description: 'Expert plumber specializing in residential and commercial plumbing systems and emergency repairs.',
    bio: 'With 15 years of plumbing experience, I provide reliable and professional plumbing services. I specialize in emergency repairs, bathroom remodeling, and complex pipe installations.',
    email: 'carlos@riveraplumbing.com',
    phone: '+1 (555) 456-7890',
    workHistory: [
      {
        company: 'Rivera Plumbing Solutions',
        role: 'Master Plumber & Owner',
        duration: '2015 - Present',
        description: 'Operate full-service plumbing business serving Houston area. Specialize in emergency repairs and bathroom renovations.'
      }
    ],
    education: [
      {
        school: 'Houston Community College',
        degree: 'Plumbing Certification',
        year: '2009'
      }
    ],
    socialLinks: {
      website: 'https://riveraplumbing.com'
    },
    isActive: true
  },
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    role: 'Hair Stylist & Colorist',
    location: 'Los Angeles, CA',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 156,
    skills: ['Hair Cutting', 'Color Specialist', 'Balayage', 'Extensions', 'Bridal Styling'],
    experience: '8+ years',
    hourlyRate: '$120/hr',
    description: 'Creative hair stylist and colorist known for trendy cuts and stunning color transformations.',
    bio: 'I\'m a passionate hair stylist with 8 years of experience creating beautiful transformations. I specialize in modern cutting techniques, color corrections, and bridal styling.',
    email: 'sarah@mitchellhairsalon.com',
    phone: '+1 (555) 567-8901',
    workHistory: [
      {
        company: 'Mitchell Hair Studio',
        role: 'Senior Stylist & Colorist',
        duration: '2020 - Present',
        description: 'Provide premium hair services including cuts, color, and styling. Built loyal clientele of 200+ regular customers.'
      }
    ],
    education: [
      {
        school: 'Aveda Institute Los Angeles',
        degree: 'Cosmetology License',
        year: '2016'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/sarahmitchellhair',
      website: 'https://mitchellhairsalon.com'
    },
    isActive: true
  },
  {
    id: 'jennifer-adams',
    name: 'Jennifer Adams',
    role: 'Elementary School Teacher',
    location: 'Portland, OR',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b90e7f76?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    reviews: 43,
    skills: ['Curriculum Development', 'Classroom Management', 'Special Needs', 'Math & Science', 'Parent Communication'],
    experience: '10+ years',
    hourlyRate: '$45/hr',
    description: 'Dedicated elementary teacher with expertise in creating engaging learning environments for young students.',
    bio: 'I\'ve been teaching elementary students for 10 years and love creating engaging, inclusive learning environments. I specialize in differentiated instruction and supporting students with diverse learning needs.',
    email: 'jennifer@adamstutoring.com',
    phone: '+1 (555) 678-9012',
    workHistory: [
      {
        company: 'Portland Elementary School District',
        role: '3rd Grade Teacher',
        duration: '2018 - Present',
        description: 'Teach 3rd grade with focus on literacy and STEM education. Mentor new teachers and lead curriculum development initiatives.'
      }
    ],
    education: [
      {
        school: 'Portland State University',
        degree: 'M.Ed. Elementary Education',
        year: '2014'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jenniferadams'
    },
    isActive: true
  }
];

export const getProfileById = (id: string): Profile | undefined => {
  return profiles.find(profile => profile.id === id);
};