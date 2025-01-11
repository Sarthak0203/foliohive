"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsChart from "@/components/AnalyticsChart";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function ProjectAnalytics() {
    const { projectId } = useParams();
    const [analyticsData, setAnalyticsData] = useState({
        views: [],
        interactions: [],
        labels: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch project analytics from the backend
        async function fetchAnalytics() {
            try {
                const response = await fetch(`/api/projects/${projectId}/analytics`);
                const data = await response.json();
                setAnalyticsData({
                    labels: data.labels,
                    views: data.views,
                    interactions: data.interactions,
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            }
        }
        fetchAnalytics();
    }, [projectId]);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Project Analytics</h1>
                {loading ? (
                    <p>Loading analytics...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Views Over Time</h2>
                            <AnalyticsChart
                                data={{
                                    labels: analyticsData.labels,
                                    values: analyticsData.views,
                                }}
                            />
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Interactions Over Time</h2>
                            <AnalyticsChart
                                data={{
                                    labels: analyticsData.labels,
                                    values: analyticsData.interactions,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
