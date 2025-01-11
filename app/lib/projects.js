// lib/projects.js

import Project from '@/models/Project';
import { connectToDatabase } from './mongodb'; // Ensure this utility is used to connect to MongoDB

// Get all projects
export const getAllProjects = async () => {
  await connectToDatabase(); // Ensure the DB connection is made
  try {
    const projects = await Project.find(); // Fetch all projects from the database
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
};

// Get project by unique projectId
export const getProjectBySlug = async (projectId) => {
  await connectToDatabase(); // Ensure the DB connection is made
  try {
    const project = await Project.findOne({ projectId }); // Find project by the projectId
    return project;
  } catch (error) {
    console.error("Error fetching project by projectId:", error);
    throw new Error("Failed to fetch project by projectId");
  }
};

// Create a new project
export const createProject = async (projectData) => {
  await connectToDatabase(); // Ensure the DB connection is made
  try {
    const newProject = new Project(projectData); // Create a new project
    await newProject.save(); // Save project to the database
    return { success: true, data: newProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message };
  }
};
