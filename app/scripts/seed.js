const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.js');
const Project = require('../models/Project.js');

dotenv.config();

// Helper function to generate a slug from a string
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const generateRandomMetrics = () => ({
  views: Math.floor(Math.random() * 1000),
  weeklyViews: Math.floor(Math.random() * 500),
  monthlyViews: Math.floor(Math.random() * 2000),
  quarterlyViews: Math.floor(Math.random() * 5000),
  halfYearlyViews: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 100),
  shares: Math.floor(Math.random() * 50),
  bookmarks: Math.floor(Math.random() * 30),
  reactions: Math.floor(Math.random() * 80)
});

const sampleTags = [
  ['react', 'frontend', 'web'],
  ['nodejs', 'backend', 'api'],
  ['fullstack', 'javascript', 'mongodb'],
  ['design', 'ui', 'ux'],
  ['mobile', 'react-native', 'ios']
];

const sampleProjects = [
  {
    name: 'E-commerce Dashboard',
    description: 'A modern dashboard for managing online store analytics and orders.',
    tags: sampleTags[0]
  },
  {
    name: 'Social Media API',
    description: 'RESTful API backend for a social media platform with real-time features.',
    tags: sampleTags[1]
  },
  {
    name: 'Task Management App',
    description: 'Full-stack application for team collaboration and project management.',
    tags: sampleTags[2]
  },
  {
    name: 'Portfolio Website',
    description: 'Personal portfolio showcasing projects and skills.',
    tags: sampleTags[3]
  },
  {
    name: 'Fitness Tracking App',
    description: 'Mobile application for tracking workouts and nutrition.',
    tags: sampleTags[4]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Database connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Existing data cleared.');

    // Create users
    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);
    console.log('Sample users created:', users.length);

    // Create projects with slugs and random metrics
    const projects = await Promise.all(
      sampleProjects.map(async (project) => {
        const owner = users[Math.floor(Math.random() * users.length)];
        const metrics = generateRandomMetrics();
        
        const comments = Array(Math.floor(Math.random() * 5) + 1)
          .fill(null)
          .map((_, i) => `Sample comment ${i + 1} for ${project.name}`);
    
        return Project.create({
          ...project,
          owner: owner._id,
          comments,
          ...metrics,
          status: ['draft', 'published', 'archived'][Math.floor(Math.random() * 3)]
        });
      })
    );

    console.log('Sample projects created:', projects.length);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();