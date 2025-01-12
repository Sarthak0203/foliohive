"use client"
import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

import { Button } from '@/components/ui/Button';
import { Bell, Settings, Share2, Trophy, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from "@/Components/ui/Avatar";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { isAuthenticated, user:authUser, loading } = useContext(AuthContext);
  const [loading1, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || loading1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  const { user, projects, recentActivity, topProjects } = dashboardData;

  // Prepare analytics data for the chart
  const analyticsData = projects.map(project => ({
    name: project.name,
    views: project.views,
    engagement: project.totalEngagement
  }));

  if(!isAuthenticated){
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.stats.totalProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.stats.publishedProjects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.stats.totalViews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.stats.totalEngagement}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects and Analytics Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Project Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                  <Line type="monotone" dataKey="engagement" stroke="#82ca9d" name="Engagement" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Project List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                    <Link key={project._id} href={`/projects/${project._id}`}>
                  <div key={project._id} className="p-4 bg-white rounded-lg shadow hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        project.status === 'published' ? 'bg-green-100 text-green-800' :
                        project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{project.description}</p>
                    <div className="mt-4 flex space-x-4 text-sm text-gray-500">
                      <span>👁️ {project.views} views</span>
                      <span>❤️ {project.likes} likes</span>
                      <span>💬 {project.comments.length} comments</span>
                    </div>
                  </div>
                </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">
                      New comment on {activity.name} • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProjects.map((project, index) => (
                  <div key={project._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-500">#{index + 1}</span>
                      <span>{project.name}</span>
                    </div>
                    <span className="font-medium">{project.views} views</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;