import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface JoinFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  company: string;
  experience: string;
  skills: string;
  bio: string;
  portfolio: string;
  linkedIn: string;
}

const JoinUs = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<JoinFormData>();
  const { toast } = useToast();

  const onSubmit = (data: JoinFormData) => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We'll review your application and get back to you soon.",
    });
    
    reset();
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profiles" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profiles
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Join Our Talent Network</h1>
            <p className="text-lg text-muted-foreground">
              Share your details and become part of our exclusive network of professionals
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Application Form
            </CardTitle>
            <CardDescription>
              Fill out the form below to apply for our talent network
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: 'First name is required' })}
                      className="mt-1"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="mt-1"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    {...register('location', { required: 'Location is required' })}
                    placeholder="City, Country"
                    className="mt-1"
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Information
                </h3>
                
                <div>
                  <Label htmlFor="role">Current Role/Title *</Label>
                  <Input
                    id="role"
                    {...register('role', { required: 'Role is required' })}
                    placeholder="e.g., Senior Software Engineer"
                    className="mt-1"
                  />
                  {errors.role && (
                    <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company">Current Company</Label>
                  <Input
                    id="company"
                    {...register('company')}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    {...register('experience', { required: 'Experience is required' })}
                    placeholder="e.g., 5+ years"
                    className="mt-1"
                  />
                  {errors.experience && (
                    <p className="text-sm text-destructive mt-1">{errors.experience.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="skills">Key Skills *</Label>
                  <Input
                    id="skills"
                    {...register('skills', { required: 'Skills are required' })}
                    placeholder="e.g., React, Node.js, Python, Design Systems"
                    className="mt-1"
                  />
                  {errors.skills && (
                    <p className="text-sm text-destructive mt-1">{errors.skills.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    {...register('bio', { required: 'Bio is required' })}
                    placeholder="Tell us about your professional background and what you're passionate about..."
                    className="mt-1 min-h-[100px]"
                  />
                  {errors.bio && (
                    <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Links & Portfolio</h3>
                
                <div>
                  <Label htmlFor="portfolio">Portfolio Website</Label>
                  <Input
                    id="portfolio"
                    {...register('portfolio')}
                    placeholder="https://yourportfolio.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                  <Input
                    id="linkedIn"
                    {...register('linkedIn')}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Submit Application
                </Button>
                
                <p className="text-sm text-muted-foreground text-center mt-4">
                  By submitting this form, you agree to our terms and conditions.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinUs;