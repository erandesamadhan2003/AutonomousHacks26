import mongoose from "mongoose";

const agentJobSchema = new mongoose.Schema({
    draftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DraftPost',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    agentStatuses: {
        captionAgent: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },
        imageAgent: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },
        videoAgent: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },
        musicAgent: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        }
    },
    error: String,
    completedAt: Date
}, {
    timestamps: true
});

// Indexes
agentJobSchema.index({ draftId: 1 });
agentJobSchema.index({ userId: 1, status: 1 });

export const AgentJob = mongoose.model('AgentJob', agentJobSchema);