"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, Mail, Briefcase, MapPin, Link as LinkIcon, Github, Twitter, Linkedin, Link } from "lucide-react";



export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Full Stack Developer",
        location: "San Francisco, CA",
        bio: "Passionate developer with 5+ years of experience in building web applications. Focused on creating user-friendly interfaces and scalable backend solutions.",
        website: "https://johndoe.dev",
        github: "johndoe",
        twitter: "johndoe",
        linkedin: "johndoe",
        skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"],
        experience: [
            {
                role: "Senior Developer",
                company: "Tech Corp",
                period: "2020 - Present",
                description: "Leading frontend development team and architecting scalable solutions."
            },
            {
                role: "Full Stack Developer",
                company: "StartUp Inc",
                period: "2018 - 2020",
                description: "Developed and maintained multiple web applications."
            }
        ],
        education: [
            {
                degree: "M.S. Computer Science",
                school: "Tech University",
                year: "2018"
            },
            {
                degree: "B.S. Computer Science",
                school: "State University",
                year: "2016"
            }
        ],
        stats: {
            projects: 15,
            contributions: 247,
            followers: 89,
            following: 56
        }
    });

    const handleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsEditing(false);
        setLoading(false);
    };

    const avatarUrl = `/api/placeholder/150/150`;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Profile Header */}
                <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="px-6 py-4 relative">
                        <div className="absolute -top-12">
                            <div className="relative">
                                <img
                                    src={avatarUrl}
                                    alt={profile.name}
                                    className="w-24 h-24 rounded-full border-4 border-white"
                                />
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-1 bg-gray-100 rounded-full border border-gray-200">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-12">
                            <div className="flex justify-between items-start">
                                <div>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            className="text-2xl font-bold mb-1 border rounded px-2 py-1"
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
                                    )}
                                    <div className="flex items-center text-gray-600 space-x-4">
                                        <span className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-1" />
                                            {profile.role}
                                        </span>
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {profile.location}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    onClick={isEditing ? handleSave : handleEdit}
                                    className={`${isEditing ? "bg-green-500" : "bg-blue-500"} text-white px-6`}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {Object.entries(profile.stats).map(([key, value]) => (
                        <Card key={key}>
                            <CardContent className="p-4">
                                <p className="text-gray-600 capitalize">{key}</p>
                                <p className="text-2xl font-bold">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* About */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-gray-600">{profile.bio}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Connect</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <a href={profile.website} className="flex items-center text-gray-600 hover:text-blue-500">
                                    <LinkIcon className="w-5 h-5 mr-2" />
                                    {profile.website}
                                </a>
                                <a href={`https://github.com/${profile.github}`} className="flex items-center text-gray-600 hover:text-blue-500">
                                    <Github className="w-5 h-5 mr-2" />
                                    {profile.github}
                                </a>
                                <a href={`https://twitter.com/${profile.twitter}`} className="flex items-center text-gray-600 hover:text-blue-500">
                                    <Twitter className="w-5 h-5 mr-2" />
                                    {profile.twitter}
                                </a>
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} className="flex items-center text-gray-600 hover:text-blue-500">
                                    <LinkIcon className="w-5 h-5 mr-2" />
                                    {profile.linkedin}
                                </a>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {profile.experience.map((exp, index) => (
                                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                                        <h3 className="font-semibold text-lg">{exp.role}</h3>
                                        <p className="text-gray-600">{exp.company} • {exp.period}</p>
                                        <p className="text-gray-600 mt-2">{exp.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {profile.education.map((edu, index) => (
                                    <div key={index}>
                                        <h3 className="font-semibold">{edu.degree}</h3>
                                        <p className="text-gray-600">{edu.school} • {edu.year}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}