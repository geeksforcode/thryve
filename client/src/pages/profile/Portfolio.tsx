import React from 'react';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with React, Node.js, and Stripe integration. Features include user authentication, product management, shopping cart, and secure payment processing.',
      longDescription: 'This comprehensive e-commerce platform was designed to handle high-volume transactions with a focus on user experience and security. The frontend utilizes React with Redux for state management, while the backend is powered by Node.js and Express. Payment processing is handled through Stripe API, ensuring secure transactions.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express'],
      liveUrl: 'https://demo-ecommerce.com',
      githubUrl: 'https://github.com/sarahchen/ecommerce-platform',
      date: '2024',
      status: 'Live'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, team features, and advanced task tracking capabilities.',
      longDescription: 'A powerful task management application that enables teams to collaborate effectively. Built with React and TypeScript for type safety, Firebase for real-time data synchronization, and Tailwind CSS for responsive design.',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop',
      tags: ['React', 'TypeScript', 'Firebase', 'Tailwind', 'Real-time'],
      liveUrl: 'https://taskmanager-demo.com',
      githubUrl: 'https://github.com/sarahchen/task-manager',
      date: '2024',
      status: 'Live'
    },
    {
      id: 3,
      title: 'Healthcare Dashboard',
      description: 'Medical data visualization dashboard for healthcare professionals with advanced analytics and reporting features.',
      longDescription: 'An intuitive dashboard designed for healthcare professionals to visualize patient data and medical analytics. Built with Vue.js for reactive components, D3.js for complex data visualizations, and Python backend for data processing.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop',
      tags: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL', 'Analytics'],
      liveUrl: 'https://healthdash-demo.com',
      githubUrl: 'https://github.com/sarahchen/health-dashboard',
      date: '2023',
      status: 'Live'
    },
    {
      id: 4,
      title: 'Mobile Banking App',
      description: 'Secure mobile banking interface with modern UX/UI design, biometric authentication, and comprehensive financial features.',
      longDescription: 'A sophisticated mobile banking application with emphasis on security and user experience. Features include biometric authentication, real-time transaction monitoring, budgeting tools, and seamless money transfers.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
      tags: ['React Native', 'Redux', 'Node.js', 'JWT', 'Biometric Auth'],
      liveUrl: 'https://banking-demo.com',
      githubUrl: 'https://github.com/sarahchen/mobile-banking',
      date: '2023',
      status: 'Live'
    },
    {
      id: 5,
      title: 'AI-Powered Chat Application',
      description: 'Real-time chat application with AI-powered features including sentiment analysis and smart suggestions.',
      longDescription: 'An innovative chat platform that integrates artificial intelligence to enhance user communication. Features include real-time messaging, AI-powered sentiment analysis, smart reply suggestions, and advanced moderation tools.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=500&fit=crop',
      tags: ['React', 'Socket.io', 'AI/ML', 'Node.js', 'WebRTC'],
      liveUrl: 'https://aichat-demo.com',
      githubUrl: 'https://github.com/sarahchen/ai-chat',
      date: '2024',
      status: 'Beta'
    },
    {
      id: 6,
      title: 'Digital Marketplace',
      description: 'Multi-vendor marketplace platform with advanced search, reviews, and seller management features.',
      longDescription: 'A comprehensive digital marketplace that connects buyers and sellers. The platform includes advanced search capabilities, review systems, seller dashboards, and integrated payment processing for multiple vendors.',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop',
      tags: ['Next.js', 'PostgreSQL', 'Stripe', 'AWS', 'GraphQL'],
      liveUrl: 'https://marketplace-demo.com',
      githubUrl: 'https://github.com/sarahchen/digital-marketplace',
      date: '2023',
      status: 'Live'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/dashboard">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Dashboard
              </Button>
            </Link>
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">Portfolio</h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            A showcase of my recent projects and technical expertise across various domains.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-6">
                  <div className="flex gap-3">
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Live Demo
                    </Button>
                    <Button size="sm" variant="outline" className="bg-card/90 hover:bg-card">
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold gradient-text">{project.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{project.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      project.status === 'Live' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {project.longDescription}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-accent to-secondary rounded-2xl p-8">
            <h3 className="text-2xl font-bold gradient-text mb-4">Interested in Working Together?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and create innovative solutions. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <Link to="/contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start a Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;