"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QRCodeGenerator from "@/Components/QRCodeGenerator";

export default function Page() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        // Set the current URL after component mounts
        setCurrentUrl(window.location.href);
        
        // Fetch project details from the backend
        async function fetchProject() {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                if (!response.ok) {
                    throw new Error('Project not found');
                }
                const data = await response.json();
                setProject(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch project details:", error);
                setLoading(false);
            }
        }

        fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Project Details</h1>
                <p>Loading project...</p>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Project Details</h1>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <p className="text-red-500">Project not found</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Project Details</h1>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">{project.name}</h2>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Owner</h3>
                            <p className="text-gray-700">{project.owner}</p>
                        </div>
                        
                        {project.tags && project.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {project.tags.map((tag, index) => (
                                        <span 
                                            key={index}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Likes</p>
                                <p className="text-xl font-semibold">{project.likes}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Comments</p>
                                <p className="text-xl font-semibold">{project.comments?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {currentUrl && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Generated QR Code</h3>
                            <QRCodeGenerator value={currentUrl} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}