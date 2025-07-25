import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Eye, Star, TrendingUp, Calendar, MessageCircle, FileText, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Profiles',
      value: '11',
      icon: Users,
      trend: '+2 this week',
      color: 'text-blue-600'
    },
    {
      title: 'Profile Views',
      value: '2,345',
      icon: Eye,
      trend: '+15% this month',
      color: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      icon: Star,
      trend: '+0.2 from last month',
      color: 'text-yellow-600'
    },
    {
      title: 'Active Talent',
      value: '10',
      icon: TrendingUp,
      trend: '91% online',
      color: 'text-purple-600'
    }
  ];

  const recentActivity = [
    { action: 'New profile created', user: 'Sarah Chen', time: '2 hours ago' },
    { action: 'Profile updated', user: 'Mike Thompson', time: '4 hours ago' },
    { action: 'New review received', user: 'Carlos Rivera', time: '6 hours ago' },
    { action: 'Contact request', user: 'Maria Gonzalez', time: '8 hours ago' },
    { action: 'CV downloaded', user: 'Alex Rodriguez', time: '1 day ago' }
  ];

  const quickActions = [
    { name: 'View All Profiles', icon: Users, link: '/profiles', color: 'bg-blue-600' },
    { name: 'Analytics', icon: BarChart3, link: '/analytics', color: 'bg-green-600' },
    { name: 'Messages', icon: MessageCircle, link: '/contact', color: 'bg-purple-600' },
    { name: 'Reports', icon: FileText, link: '/reports', color: 'bg-yellow-600' },
    { name: 'Settings', icon: Settings, link: '/settings', color: 'bg-gray-600' },
    { name: 'Portfolio', icon: Eye, link: '/portfolio', color: 'bg-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <Link to="/">
            <Button className="mb-4 lg:mb-6 bg-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Talent Platform Dashboard
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Manage your talent network and track performance
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link to="/contact">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {stats.map((stat, index) => (
            <Link key={index} to="/profiles">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                      <p className={`text-xs sm:text-sm ${stat.color} mt-1`}>{stat.trend}</p>
                    </div>
                    <div className={`p-2 lg:p-3 rounded-lg bg-accent ${stat.color}`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl gradient-text">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} to={action.link}>
                      <div className="group p-3 lg:p-4 rounded-xl bg-accent hover:bg-secondary transition-all duration-300 cursor-pointer hover:scale-105">
                        <div className={`w-8 h-8 lg:w-10 lg:h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 lg:mb-3 group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {action.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-xl gradient-text">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 lg:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <Link key={index} to="/profiles">
                      <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-foreground font-medium truncate">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="mt-6 lg:mt-8">
          <Link to="/profiles">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-2xl font-bold text-gray-900 mb-6">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-accent to-secondary rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm lg:text-base text-muted-foreground">
                      Chart visualization would go here
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                      Click to view detailed analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 lg:mt-8 lg:hidden">
          <Card className="bg-gradient-to-r from-accent to-secondary">
            <CardContent className="p-4 text-center">
              <h3 className="text-lg font-bold gradient-text mb-2">Mobile Optimized</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access your dashboard anywhere, anytime
              </p>
              <Button variant="outline" className="w-full">
                Download Mobile App
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;