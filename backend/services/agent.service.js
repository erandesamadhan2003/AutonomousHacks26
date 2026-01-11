import axios from 'axios';
import FormData from 'form-data';
import { AgentJob } from '../models/AgentJob.js';
import { DraftPost } from '../models/DraftPost.js';

const PYTHON_AGENT_BASE_URL = process.env.PYTHON_AGENT_URL || 'http://localhost:5000';
const MUSIC_AGENT_URL = process.env.MUSIC_SUGGESTION_AGENT_URL || 'http://localhost:5004';
const VIDEO_AGENT_URL = process.env.VIDEO_GENERATION_AGENT_URL || 'https://untidier-papal-aubrie.ngrok-free.dev';

// Start agent pipeline
export const startAgentPipeline = async ({ draftId, userId, originalCaption, originalImages, platforms }) => {
    console.log('\n🔄 AGENT PIPELINE INITIALIZATION');
    console.log(`   Draft ID: ${draftId}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Images: ${originalImages.length}`);
    console.log(`   Platforms: ${platforms.join(', ')}`);

    try {
        const job = await AgentJob.create({
            draftId,
            userId,
            status: 'pending',
            agentStatuses: {
                captionAgent: 'pending',
                imageAgent: 'pending',
                videoAgent: 'pending',
                musicAgent: 'pending'
            }
        });

        console.log(`✓ Job created: ${job._id}\n`);

        console.log('🎯 LAUNCHING 4 AI AGENTS IN PARALLEL...');
        console.log('   1️⃣  Caption Agent (Gemini AI)');
        console.log('   2️⃣  Image Agent (PIL + OpenCV)');
        console.log('   3️⃣  Video Agent (Stable Diffusion)');
        console.log('   4️⃣  Music Agent (iTunes API)\n');

        // Call all agents in parallel
        const agentPromises = [
            callCaptionAgent(draftId, originalCaption, platforms, originalImages),
            callImageAgent(draftId, originalImages),
            callVideoAgent(draftId, originalImages),
            callMusicAgent(draftId, originalCaption, originalImages)
        ];

        Promise.all(agentPromises)
            .then(async ([captions, images, video, music]) => {
                console.log('\n✅ ALL AGENTS COMPLETED SUCCESSFULLY');
                console.log('━'.repeat(80));
                console.log(`   Captions: ${captions?.length || 0} generated`);
                console.log(`   Images: ${images?.length || 0} processed`);
                console.log(`   Video: ${video ? 'Generated' : 'Not generated'}`);
                console.log(`   Music: ${music?.length || 0} suggestions`);
                console.log('━'.repeat(80));

                await updateDraftWithResults(draftId, { captions, images, video, music });
                await AgentJob.findByIdAndUpdate(job._id, {
                    status: 'completed',
                    completedAt: new Date()
                });

                console.log('✓ Draft updated and marked as ready\n');
            })
            .catch(async (error) => {
                console.error('\n❌ AGENT PIPELINE FAILED');
                console.error('Error:', error.message);
                console.error('━'.repeat(80));

                await AgentJob.findByIdAndUpdate(job._id, {
                    status: 'failed',
                    error: error.message,
                    completedAt: new Date()
                });
            });

        return job;
    } catch (error) {
        console.error('❌ Pipeline initialization failed:', error);
        throw error;
    }
};

// Call Caption Agent
const callCaptionAgent = async (draftId, caption, platforms, images) => {
    const agentStart = Date.now();
    console.log('\n1️⃣  CAPTION AGENT - START');
    console.log('─'.repeat(80));

    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'processing' }
        );
        console.log('   Status: Processing');

        const captions = [];

        for (const platform of platforms) {
            const imageUrl = images && images.length > 0 ? images[0].url : null;

            if (!imageUrl) {
                console.warn('   ⚠️  No image available');
                continue;
            }

            if (platform === 'instagram') {
                console.log(`   🖼️  Processing for ${platform}`);
                console.log(`   📥 Downloading image: ${imageUrl.substring(0, 60)}...`);

                const formData = new FormData();
                const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                formData.append('image', Buffer.from(imageResponse.data), {
                    filename: 'image.jpg',
                    contentType: 'image/jpeg'
                });
                formData.append('intent', caption || 'Generate engaging caption for social media');

                console.log(`   🤖 Calling Gemini AI...`);
                const callStart = Date.now();

                const response = await axios.post(
                    `${PYTHON_AGENT_BASE_URL}/api/instagram/optimize`,
                    formData,
                    {
                        headers: formData.getHeaders(),
                        timeout: 30000
                    }
                );

                const callTime = Date.now() - callStart;

                if (response.data.success) {
                    captions.push({
                        platform: 'instagram',
                        text: response.data.caption,
                        hashtags: response.data.hashtags
                    });
                    console.log(`   ✓ Caption generated in ${callTime}ms`);
                    console.log(`   📝 Caption: ${response.data.caption.substring(0, 80)}...`);
                    console.log(`   #️⃣  Hashtags: ${response.data.hashtags.length} tags`);
                }
            } else {
                captions.push({
                    platform,
                    text: caption || 'Check out this amazing content!',
                    hashtags: []
                });
            }
        }

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'completed' }
        );

        const agentTime = Date.now() - agentStart;
        console.log(`✅ CAPTION AGENT - COMPLETE in ${agentTime}ms`);
        console.log('─'.repeat(80));

        return captions;
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.captionAgent': 'failed' }
        );

        const agentTime = Date.now() - agentStart;
        console.error(`❌ CAPTION AGENT - FAILED after ${agentTime}ms`);
        console.error('   Error:', error.message);
        console.log('─'.repeat(80));

        return [{
            platform: platforms[0] || 'instagram',
            text: caption || 'Check out this post!',
            hashtags: []
        }];
    }
};

// Call Image Agent
const callImageAgent = async (draftId, images) => {
    const agentStart = Date.now();
    console.log('\n2️⃣  IMAGE AGENT - START');
    console.log('─'.repeat(80));

    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'processing' }
        );
        console.log('   Status: Processing');
        console.log(`   📸 Converting ${images.length} image(s) to base64...`);

        const imagesBase64 = [];
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            try {
                const response = await axios.get(img.url, { responseType: 'arraybuffer' });
                const base64 = Buffer.from(response.data).toString('base64');
                imagesBase64.push(`data:image/jpeg;base64,${base64}`);
                console.log(`   ✓ Image ${i + 1}/${images.length} converted`);
            } catch (error) {
                console.error(`   ❌ Failed to download image ${i + 1}: ${error.message}`);
            }
        }

        if (imagesBase64.length === 0) {
            throw new Error('No images could be processed');
        }

        console.log(`   🎨 Applying filters: enhanced, vibrant, professional, bold`);
        const callStart = Date.now();

        const response = await axios.post(`${PYTHON_AGENT_BASE_URL.replace('5000', '5001')}/process-images`, {
            images: imagesBase64,
            platform: 'instagram_post',
            filters: ['enhanced', 'vibrant', 'professional', 'bold'],
            enhance: true,
            cropMode: 'center'
        }, {
            timeout: 60000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const callTime = Date.now() - callStart;

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'completed' }
        );

        const agentTime = Date.now() - agentStart;

        if (response.data.success) {
            console.log(`   ✓ Images processed in ${callTime}ms`);
            console.log(`   📊 Results: ${response.data.count} images with variants`);
            console.log(`✅ IMAGE AGENT - COMPLETE in ${agentTime}ms`);
            console.log('─'.repeat(80));
            return response.data.processedImages;
        } else {
            console.log(`❌ IMAGE AGENT - NO RESULTS in ${agentTime}ms`);
            console.log('─'.repeat(80));
            return [];
        }
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.imageAgent': 'failed' }
        );

        const agentTime = Date.now() - agentStart;
        console.error(`❌ IMAGE AGENT - FAILED after ${agentTime}ms`);
        console.error('   Error:', error.message);
        console.log('─'.repeat(80));
        return [];
    }
};

// Call Video Agent
const callVideoAgent = async (draftId, images) => {
    const agentStart = Date.now();
    console.log('\n3️⃣  VIDEO AGENT - START');
    console.log('─'.repeat(80));

    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'processing' }
        );
        console.log('   Status: Processing');

        if (!images || images.length === 0) {
            console.warn('   ⚠️  No images available for video generation');
            await AgentJob.updateOne(
                { draftId },
                { 'agentStatuses.videoAgent': 'failed' }
            );
            return null;
        }

        const imageUrl = images[0].url;
        console.log(`   🖼️  Source image: ${imageUrl.substring(0, 60)}...`);
        console.log(`   📥 Downloading image...`);

        const imageResponse = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });

        const formData = new FormData();
        formData.append('image', Buffer.from(imageResponse.data), {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });

        console.log(`   🎬 Calling Video Generation API (ngrok)`);
        console.log(`   ⏳ This may take 60-120 seconds...`);
        const callStart = Date.now();

        const response = await axios.post(
            `${VIDEO_AGENT_URL}/generate`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'ngrok-skip-browser-warning': 'true'
                },
                responseType: 'arraybuffer',
                timeout: 120000,
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        const callTime = Date.now() - callStart;
        const videoBase64 = Buffer.from(response.data).toString('base64');
        const videoSize = (videoBase64.length * 0.75 / 1024).toFixed(2);
        const videoDataUrl = `data:image/gif;base64,${videoBase64}`;

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'completed' }
        );

        const agentTime = Date.now() - agentStart;
        console.log(`   ✓ Video generated in ${callTime}ms`);
        console.log(`   📊 Size: ${videoSize} KB, Format: GIF`);
        console.log(`✅ VIDEO AGENT - COMPLETE in ${agentTime}ms`);
        console.log('─'.repeat(80));

        return {
            url: videoDataUrl,
            format: 'gif',
            size: videoSize,
            generatedAt: new Date(),
            sourceImage: imageUrl
        };

    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.videoAgent': 'failed' }
        );

        const agentTime = Date.now() - agentStart;
        console.error(`❌ VIDEO AGENT - FAILED after ${agentTime}ms`);
        console.error('   Error:', error.message);

        if (error.code === 'ECONNABORTED') {
            console.error('   ⚠️  Timeout: Video generation took too long');
        }
        console.log('─'.repeat(80));

        return null;
    }
};

// Call Music Agent
const callMusicAgent = async (draftId, caption, images) => {
    const agentStart = Date.now();
    console.log('\n4️⃣  MUSIC AGENT - START');
    console.log('─'.repeat(80));

    try {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'processing' }
        );
        console.log('   Status: Processing');

        let description = caption || 'Generate music suggestions';
        if (images && images.length > 0) {
            description += ` with ${images.length} image${images.length > 1 ? 's' : ''}`;
        }

        console.log(`   📝 Caption: ${caption?.substring(0, 60) || 'None'}...`);
        console.log(`   🎵 Analyzing mood...`);
        const callStart = Date.now();

        const response = await axios.post(`${MUSIC_AGENT_URL}/suggest-music`, {
            description: description,
            caption: caption || '',
            limit: 5
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const callTime = Date.now() - callStart;

        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'completed' }
        );

        const agentTime = Date.now() - agentStart;

        if (response.data.success) {
            console.log(`   ✓ Music suggestions generated in ${callTime}ms`);
            console.log(`   🎭 Detected mood: ${response.data.detectedMood}`);
            console.log(`   🎼 Genre: ${response.data.genre}`);
            console.log(`   📊 Tracks: ${response.data.count} suggestions`);
            console.log(`✅ MUSIC AGENT - COMPLETE in ${agentTime}ms`);
            console.log('─'.repeat(80));
            return response.data.suggestions;
        } else {
            console.warn(`⚠️  MUSIC AGENT - NO RESULTS in ${agentTime}ms`);
            console.log('─'.repeat(80));
            return [];
        }
    } catch (error) {
        await AgentJob.updateOne(
            { draftId },
            { 'agentStatuses.musicAgent': 'failed' }
        );

        const agentTime = Date.now() - agentStart;
        console.error(`❌ MUSIC AGENT - FAILED after ${agentTime}ms`);
        console.error('   Error:', error.message);
        console.log('   Using fallback suggestions...');
        console.log('─'.repeat(80));

        return [
            { title: "Feel Good Music", artist: "Upbeat Playlist", mood: "upbeat", genre: "Pop" },
            { title: "Happy Vibes", artist: "Positive Mix", mood: "happy", genre: "Pop" },
            { title: "Energy Boost", artist: "Motivational Tracks", mood: "energetic", genre: "Dance" }
        ];
    }
};

// Update draft with agent results
const updateDraftWithResults = async (draftId, { captions, images, video, music }) => {
    console.log('\n💾 UPDATING DRAFT WITH AI RESULTS');
    console.log('─'.repeat(80));

    try {
        const draft = await DraftPost.findById(draftId);
        if (!draft) {
            console.error('   ❌ Draft not found');
            return;
        }

        if (captions && captions.length > 0) {
            draft.aiGeneratedCaptions = captions;
            draft.selectedCaption = captions[0]?.text || draft.originalCaption;
            const allHashtags = captions.flatMap(c => c.hashtags || []);
            if (allHashtags.length > 0) {
                draft.hashtags = [...new Set([...draft.hashtags, ...allHashtags])];
            }
            console.log(`   ✓ Captions: ${captions.length} added`);

            // Log generated captions
            console.log('\n   📝 GENERATED CAPTIONS:');
            captions.forEach((cap, idx) => {
                console.log(`   ${idx + 1}. Platform: ${cap.platform}`);
                console.log(`      Caption: ${cap.text.substring(0, 100)}${cap.text.length > 100 ? '...' : ''}`);
                console.log(`      Hashtags: ${cap.hashtags?.join(', ') || 'None'}`);
            });
        }

        if (images && images.length > 0) {
            draft.aiGeneratedImages = images;
            console.log(`\n   ✓ Images: ${images.length} processed versions`);

            // Log image variants with URLs
            console.log('\n   🎨 PROCESSED IMAGE VARIANTS:');
            images.forEach((img, idx) => {
                console.log(`   Image ${idx + 1}:`);
                console.log(`      Platform: ${img.platform}`);
                console.log(`      Dimensions: ${img.dimensions?.width}x${img.dimensions?.height}`);
                console.log(`      Variants: ${img.variantCount}`);
                img.variants?.forEach((variant, vIdx) => {
                    console.log(`        ${vIdx + 1}. ${variant.name}`);
                    console.log(`           URL: ${variant.url.substring(0, 100)}...`);
                });
            });
        }

        if (video) {
            draft.aiGeneratedVideo = video;
            console.log(`\n   ✓ Video: Generated (${video.size} KB)`);

            // Log complete video details
            console.log('\n   🎬 GENERATED VIDEO DETAILS:');
            console.log(`      Format: ${video.format}`);
            console.log(`      Size: ${video.size} KB`);
            console.log(`      Generated At: ${video.generatedAt}`);
            console.log(`      Source Image: ${video.sourceImage}`);
            console.log(`      Video URL (first 200 chars): ${video.url.substring(0, 200)}...`);
            console.log(`      Full URL length: ${video.url.length} characters`);
        }

        if (music && music.length > 0) {
            draft.musicSuggestions = music;
            console.log(`\n   ✓ Music: ${music.length} suggestions`);

            // Log music suggestions
            console.log('\n   🎵 MUSIC SUGGESTIONS:');
            music.forEach((track, idx) => {
                console.log(`   ${idx + 1}. ${track.title} - ${track.artist}`);
                console.log(`      Genre: ${track.genre} | Mood: ${track.mood}`);
                if (track.previewUrl) {
                    console.log(`      Preview: ${track.previewUrl}`);
                }
                if (track.iTunesUrl) {
                    console.log(`      iTunes: ${track.iTunesUrl}`);
                }
            });
        }

        draft.status = 'ready';
        await draft.save();

        console.log(`\n   ✓ Draft status: ${draft.status}`);

        // Log complete draft summary
        console.log('\n   📊 COMPLETE DRAFT SUMMARY:');
        console.log(`      Draft ID: ${draft._id}`);
        console.log(`      User ID: ${draft.userId}`);
        console.log(`      Status: ${draft.status}`);
        console.log(`      Platforms: ${draft.platforms.join(', ')}`);
        console.log(`      Original Images: ${draft.originalImages.length}`);

        // Log original image URLs
        if (draft.originalImages.length > 0) {
            console.log('\n   📸 ORIGINAL IMAGES (Cloudinary URLs):');
            draft.originalImages.forEach((img, idx) => {
                console.log(`      ${idx + 1}. ${img.url}`);
                console.log(`         Public ID: ${img.publicId}`);
                console.log(`         Format: ${img.format}`);
                console.log(`         Dimensions: ${img.width}x${img.height}`);
            });
        }

        console.log('\n✅ DRAFT UPDATE COMPLETE');
        console.log('━'.repeat(80));

        // Log access instructions
        console.log('\n📌 HOW TO ACCESS THIS CONTENT:');
        console.log(`   1. Frontend: GET /api/posts/draft/${draft._id}`);
        console.log(`   2. Direct DB query: db.draftposts.findOne({_id: ObjectId("${draft._id}")})`);
        console.log(`   3. Video URL is stored in: draft.aiGeneratedVideo.url`);
        console.log(`   4. Images are in: draft.originalImages[] (Cloudinary)`);
        console.log(`   5. AI processed images: draft.aiGeneratedImages[]`);
        console.log('━'.repeat(80));

    } catch (error) {
        console.error('\n❌ DRAFT UPDATE FAILED');
        console.error('   Error:', error.message);
        console.error('   Stack:', error.stack);
        console.log('─'.repeat(80));
    }
};

// Get agent job status
export const getAgentJobStatus = async (jobId) => {
    try {
        const job = await AgentJob.findById(jobId);
        return job;
    } catch (error) {
        console.error('Get agent job status error:', error);
        throw error;
    }
};
