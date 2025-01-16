"use client"
import React, { useContext, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback } from "@/Components/ui/Avatar";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { isAuthenticated, user: authUser, loading } = useContext(AuthContext);
  const [loading1, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const router = useRouter();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    newComments: true,
    newLikes: true,
    newFollowers: true,
    projectUpdates: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          credentials: 'include',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
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

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

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

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  const { user, projects, recentActivity, topProjects } = dashboardData;

  const analyticsData = projects.map(project => ({
    name: project.name,
    views: project.views,
    engagement: project.totalEngagement
  }));

  const handleOpenNotifications = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleNotificationSettingChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings(prevSettings => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: notificationSettings }),
      });

      if (response.ok) {
        console.log('Settings saved successfully');
        handleCloseSettings();
      } else {
        const data = await response.json();
        console.error('Failed to save settings:', data.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={handleOpenNotifications}>
            <Bell className="h-6 w-6" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={handleOpenSettings}>
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <Link key={project._id} href={`/projects/${project._id}`}>
                    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md">
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

        <div className="space-y-6">
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

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Notifications</h2>
            <p>No new notifications.</p>
            <Button onClick={handleCloseNotifications}>Close</Button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Settings</h2>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Notification Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newComments"
                    name="newComments"
                    checked={notificationSettings.newComments}
                    onChange={handleNotificationSettingChange}
                  />
                  <label htmlFor="newComments" className="ml-2">
                    New Comments
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newLikes"
                    name="newLikes"
                    checked={notificationSettings.newLikes}
                    onChange={handleNotificationSettingChange}
                  />
                  <label htmlFor="newLikes" className="ml-2">
                    New Likes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newFollowers"
                    name="newFollowers"
                    checked={notificationSettings.newFollowers}
                    onChange={handleNotificationSettingChange}
                  />
                  <label htmlFor="newFollowers" className="ml-2">
                    New Followers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="projectUpdates"
                    name="projectUpdates"
                    checked={notificationSettings.projectUpdates}
                    onChange={handleNotificationSettingChange}
                  />
                  <label htmlFor="projectUpdates" className="ml-2">
                    Project Updates
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Profile Settings</h3>
              {/* ... add profile settings inputs here ... */}
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Account Settings</h3>
              {/* ... add account settings inputs here ... */}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings}>Save</Button>
              <Button onClick={handleCloseSettings} variant="ghost">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;