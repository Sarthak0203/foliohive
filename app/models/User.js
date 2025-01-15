// User.js (CommonJS)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    profilePicture: { type: String },

    // Add profile fields directly to the User schema
    role: { type: String },
    location: { type: String },
    bio: { type: String },
    website: { type: String },
    github: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
    skills: [{ type: String }], // Array of skills
    experience: [
      {
        role: { type: String },
        company: { type: String },
        period: { type: String },
        description: { type: String },
      }
    ],
    education: [
      {
        degree: { type: String },
        school: { type: String },
        year: { type: String },
      }
    ],
    stats: {
      projects: { type: Number, default: 0 },
      contributions: { type: Number, default: 0 },
      followers: { type: Number, default: 0 },
      following: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);