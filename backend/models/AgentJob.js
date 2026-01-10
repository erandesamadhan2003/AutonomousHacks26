import mongoose from "mongoose";

const agentJobSchema = new mongoose.Schema({
    draftPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DraftPost',
        required: true
    },
    agentType: {
        type: String,
        enum: ['image_processing', 'caption_generation', 'video_generation', 'music_suggestion'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    priority: {
        type: Number,
        default: 5 // 1-10, higher = more urgent
    },
    inputData: {
        type: mongoose.Schema.Types.Mixed
    },
    outputData: {
        type: mongoose.Schema.Types.Mixed
    },
    error: {
        message: String,
        stack: String
    },
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    },
    startedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

agentJobSchema.index({ status: 1, priority: -1 });
agentJobSchema.index({ draftPostId: 1, agentType: 1 });

// Add methods before module.exports
agentJobSchema.methods.markAsProcessing = async function () {
    this.status = 'processing';
    this.startedAt = new Date();
    await this.save();
    return this;
};

agentJobSchema.methods.markAsCompleted = async function (outputData) {
    this.status = 'completed';
    this.outputData = outputData;
    this.completedAt = new Date();
    await this.save();
    return this;
};

agentJobSchema.methods.markAsFailed = async function (errorMessage, errorStack) {
    this.status = 'failed';
    this.error = {
        message: errorMessage,
        stack: errorStack
    };
    this.completedAt = new Date();
    await this.save();
    return this;
};

agentJobSchema.methods.incrementRetry = async function () {
    this.retryCount += 1;
    if (this.retryCount < this.maxRetries) {
        this.status = 'pending';
    }
    await this.save();
    return this;
};

export const AgentJob = mongoose.model('AgentJob', agentJobSchema);