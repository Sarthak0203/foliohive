"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Camera, Mail, Briefcase, MapPin, Link as LinkIcon, Github, Twitter, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        role: "",
        location: "",
        bio: "",
        website: "",
        github: "",
        twitter: "",
        linkedin: "",
        skills: [],
        experience: [],
        education: [],
        stats: {
            projects: 0,
            contributions: 0,
            followers: 0,
            following: 0
        },
        profilePicture: '/images/avatar1.jpg',
    });

    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/profile", {
                    method: "GET",
                    credentials: "include",
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile(data.profile);
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile((prevProfile) => ({ ...prevProfile, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                console.log('Profile updated successfully');
                const updatedProfileResponse = await fetch('/api/profile', {
                    method: "GET",
                    credentials: "include",
                });
                if (updatedProfileResponse.ok) {
                    const updatedProfileData = await updatedProfileResponse.json();
                    setProfile(updatedProfileData.profile);
                } else {
                    console.error('Failed to fetch updated profile');
                }
            } else {
                const data = await response.json();
                console.error('Profile update failed:', data.error);
            }
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setIsEditing(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="px-6 py-4 relative">
                        <div className="absolute -top-12">
                            <div className="relative">
                                <img
                                    src={profile.profilePicture}
                                    alt={profile.name}
                                    className="w-24 h-24 rounded-full border-4 border-white"
                                />
                                {isEditing && (
                                    <div className="absolute bottom-0 right-0 p-1 bg-gray-100 rounded-full border border-gray-200">
                                        <label htmlFor="profilePictureInput">
                                            <Camera className="w-4 h-4 cursor-pointer" />
                                        </label>
                                        <input
                                            type="file"
                                            id="profilePictureInput"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </div>
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
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="role"
                                                    value={profile.role}
                                                    onChange={handleChange}
                                                    className="text-gray-600 ml-1 border-b border-gray-600 focus:outline-none"
                                                />
                                            ) : (
                                                profile.role
                                            )}
                                        </span>
                                        <span className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={profile.location}
                                                    onChange={handleChange}
                                                    className="text-gray-600 ml-1 border-b border-gray-600 focus:outline-none"
                                                />
                                            ) : (
                                                profile.location
                                            )}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="skills"
                                            value={profile.skills.join(', ')}
                                            onChange={(e) => {
                                                const newSkills = e.target.value.split(',').map(skill => skill.trim());
                                                setProfile(prevProfile => ({ ...prevProfile, skills: newSkills }));
                                            }}
                                            className="w-full p-2 border rounded"
                                        />
                                    ) : (
                                        <>
                                            {profile.skills && profile.skills.length > 0 ? (
                                                profile.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm transition-transform duration-200 transform hover:scale-105"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No skills added yet.</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Connect</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="website"
                                            value={profile.website}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Website URL"
                                        />
                                        <input
                                            type="text"
                                            name="github"
                                            value={profile.github}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="GitHub username"
                                        />
                                        <input
                                            type="text"
                                            name="twitter"
                                            value={profile.twitter}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="Twitter username"
                                        />
                                        <input
                                            type="text"
                                            name="linkedin"
                                            value={profile.linkedin}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                            placeholder="LinkedIn username"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {profile.website ? (
                                            <a href={profile.website} className="flex items-center text-gray-600 hover:text-blue-500 transition-transform duration-200 transform hover:scale-105">
                                                <LinkIcon className="w-5 h-5 mr-2" />
                                                {profile.website}
                                            </a>
                                        ) : null}

                                        {profile.github ? (
                                            <a href={`https://github.com/${profile.github}`} className="flex items-center text-gray-600 hover:text-blue-500 transition-transform duration-200 transform hover:scale-105">
                                                <Github className="w-5 h-5 mr-2" />
                                                {profile.github}
                                            </a>
                                        ) : null}

                                        {profile.twitter ? (
                                            <a href={`https://twitter.com/${profile.twitter}`} className="flex items-center text-gray-600 hover:text-blue-500 transition-transform duration-200 transform hover:scale-105">
                                                <Twitter className="w-5 h-5 mr-2" />
                                                {profile.twitter}
                                            </a>
                                        ) : null}

                                        {profile.linkedin ? (
                                            <a href={`https://linkedin.com/in/${profile.linkedin}`} className="flex items-center text-gray-600 hover:text-blue-500 transition-transform duration-200 transform hover:scale-105">
                                                <Linkedin className="w-5 h-5 mr-2" />
                                                {profile.linkedin}
                                            </a>
                                        ) : null}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Experience</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isEditing ? (
                                    // Render input fields for experience when isEditing is true
                                    <div>
                                        {profile.experience.map((exp, index) => (
                                            <div key={index} className="mb-4">
                                                <input
                                                    type="text"
                                                    name={`experience[${index}].role`}
                                                    value={exp.role}
                                                    onChange={(e) => {
                                                        const updatedExperience = [...profile.experience];
                                                        updatedExperience[index].role = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, experience: updatedExperience }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="Role"
                                                />
                                                <input
                                                    type="text"
                                                    name={`experience[${index}].company`}
                                                    value={exp.company}
                                                    onChange={(e) => {
                                                        const updatedExperience = [...profile.experience];
                                                        updatedExperience[index].company = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, experience: updatedExperience }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="Company"
                                                />
                                                <input
                                                    type="text"
                                                    name={`experience[${index}].period`}
                                                    value={exp.period}
                                                    onChange={(e) => {
                                                        const updatedExperience = [...profile.experience];
                                                        updatedExperience[index].period = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, experience: updatedExperience }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="Period"
                                                />
                                                <textarea
                                                    name={`experience[${index}].description`}
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updatedExperience = [...profile.experience];
                                                        updatedExperience[index].description = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, experience: updatedExperience }));
                                                    }}
                                                    className="w-full p-2 border rounded"
                                                    rows={3}
                                                    placeholder="Description"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => {
                                                setProfile(prevProfile => ({
                                                    ...prevProfile,
                                                    experience: [...prevProfile.experience, { role: '', company: '', period: '', description: '' }]
                                                }));
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Add Experience
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {profile.experience && profile.experience.length > 0 ? (
                                            profile.experience.map((exp, index) => (
                                                <div key={index} className="border-l-2 border-blue-500 pl-4 transition-transform duration-200 transform hover:translate-x-2">
                                                    <h3 className="font-semibold text-lg">{exp.role}</h3>
                                                    <p className="text-gray-600">{exp.company} • {exp.period}</p>
                                                    <p className="text-gray-600 mt-2">{exp.description}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No experience added yet.</p>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Education</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    // Render input fields for education when isEditing is true
                                    <div>
                                        {profile.education.map((edu, index) => (
                                            <div key={index} className="mb-4">
                                                <input
                                                    type="text"
                                                    name={`education[${index}].degree`}
                                                    value={edu.degree}
                                                    onChange={(e) => {
                                                        const updatedEducation = [...profile.education];
                                                        updatedEducation[index].degree = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, education: updatedEducation }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="Degree"
                                                />
                                                <input
                                                    type="text"
                                                    name={`education[${index}].school`}
                                                    value={edu.school}
                                                    onChange={(e) => {
                                                        const updatedEducation = [...profile.education];
                                                        updatedEducation[index].school = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, education: updatedEducation }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="School"
                                                />
                                                <input
                                                    type="text"
                                                    name={`education[${index}].year`}
                                                    value={edu.year}
                                                    onChange={(e) => {
                                                        const updatedEducation = [...profile.education];
                                                        updatedEducation[index].year = e.target.value;
                                                        setProfile(prevProfile => ({ ...prevProfile, education: updatedEducation }));
                                                    }}
                                                    className="w-full p-2 border rounded mb-2"
                                                    placeholder="Year"
                                                />
                                            </div>
                                        ))}
                                        <Button
                                            onClick={() => {
                                                setProfile(prevProfile => ({
                                                    ...prevProfile,
                                                    education: [...prevProfile.education, { degree: '', school: '', year: '' }]
                                                }));
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Add Education
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {profile.education && profile.education.length > 0 ? (
                                            profile.education.map((edu, index) => (
                                                <div key={index} className="transition-transform duration-200 transform hover:-translate-y-2">
                                                    <h3 className="font-semibold">{edu.degree}</h3>
                                                    <p className="text-gray-600">{edu.school} • {edu.year}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No education added yet.</p>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}