"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QRCodeGenerator from "@/Components/QRCodeGenerator";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Eye, Heart, MessageSquare, Share2, Star, GitFork, AlertCircle } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const statsVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
};

export default function Page() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [iframeError, setIframeError] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error("Project not found");
        }
        const data = await response.json();
        setProject(data);

        if (data.githubLink) {
          const githubResponse = await fetch(`/api/github?repoUrl=${data.githubLink}`);
          if (githubResponse.ok) {
            const githubData = await githubResponse.json();
            setGithubData(githubData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const StatCard = ({ icon: Icon, label, value }) => (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow"
      variants={statsVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <motion.div 
        className="container mx-auto p-8 flex items-center justify-center"
        {...fadeIn}
      >
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-500 mb-2">Project Not Found</h2>
            <p className="text-gray-600">The project you're looking for doesn't exist or has been removed.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'content', label: 'Content' },
    { id: 'github', label: 'GitHub', show: !!githubData }
  ].filter(tab => !('show' in tab) || tab.show);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div 
        className="container mx-auto p-8"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
      >
        <motion.div 
          className="mb-8"
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
          <p className="text-xl text-gray-600">{project.description}</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <StatCard icon={Heart} label="Likes" value={project.likes} />
          <StatCard icon={MessageSquare} label="Comments" value={project.comments?.length || 0} />
          <StatCard icon={Eye} label="Views" value={project.views} />
          <StatCard icon={Share2} label="Shares" value={project.shares} />
        </motion.div>

        <div className="flex space-x-2 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-all ${
                activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Owner</p>
                        <p className="font-medium">{project.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge variant="outline" className="mt-1">
                          {project.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Project ID</p>
                        <p className="font-mono text-sm">{project.projectId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="animate-in fade-in duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {currentUrl && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Share Project</h3>
                    <div className="flex items-center gap-6">
                      <QRCodeGenerator value={currentUrl} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-2">Project URL</p>
                        <input 
                          type="text" 
                          value={currentUrl} 
                          readOnly 
                          className="w-full p-2 bg-gray-50 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'content' && (
            <Card>
              <CardContent className="p-6">
                {project.demoLink ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Live Demo</h3>
                    {iframeError ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600 mb-2">
                          Unable to load demo preview. This might be due to website restrictions.
                        </p>
                        <a
                          href={project.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-2"
                        >
                          Open demo in new tab
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          src={project.demoLink}
                          title="Project Demo"
                          className="w-full h-[600px]"
                          onError={(e) => setIframeError(e)}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No demo content available for this project.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'github' && githubData && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Repository Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <StatCard icon={Star} label="Stars" value={githubData.stargazers_count} />
                      <StatCard icon={GitFork} label="Forks" value={githubData.forks_count} />
                      <StatCard icon={AlertCircle} label="Issues" value={githubData.open_issues_count} />
                      <StatCard icon={Eye} label="Watchers" value={githubData.watchers_count} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Repository Info</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Owner</p>
                        <p className="font-medium">{githubData.owner.login}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">
                          {new Date(githubData.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Updated</p>
                        <p className="font-medium">
                          {new Date(githubData.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}