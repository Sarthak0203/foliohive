const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    slug: { 
      type: String, 
      unique: true,
      sparse: true
    },
    projectId: {
      type: String,
      unique: true,
      sparse: true
    },
    githubLink: { type: String },
    demoLink: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    comments: [{ type: String }],
    
    // Analytics fields
    views: { type: Number, default: 0 },
    weeklyViews: { type: Number, default: 0 },
    monthlyViews: { type: Number, default: 0 },
    quarterlyViews: { type: Number, default: 0 },
    halfYearlyViews: { type: Number, default: 0 },
    
    // Engagement metrics
    shares: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    reactions: { type: Number, default: 0 },
    
    // Status and visibility
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published'
    },
    isPublic: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Generate unique identifiers before saving
projectSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate projectId if it doesn't exist
    if (!this.projectId) {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substr(2, 5);
      this.projectId = `P${timestamp}${randomStr}`.toUpperCase();
    }
  }
  
  // Generate slug if name is modified
  if (this.isModified('name')) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      if (this.slug === slug) {
        break;
      }
      
      const existingProject = await mongoose.models.Project.findOne({ slug });
      if (!existingProject) {
        break;
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  next();
});

// Virtual for total engagement
projectSchema.virtual('totalEngagement').get(function() {
  return (this.likes || 0) + 
         (this.comments?.length || 0) + 
         (this.shares || 0) + 
         (this.bookmarks || 0) + 
         (this.reactions || 0);
});

// Create compound index for projectId and slug
projectSchema.index({ projectId: 1 });
projectSchema.index({ slug: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);