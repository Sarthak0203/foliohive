import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['like', 'comment', 'rate'], required: true },
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Interaction || mongoose.model('Interaction', interactionSchema);
