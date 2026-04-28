import mongoose from "mongoose";

const SoundSourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    soundFile: {
        type: String, 
        default: 'default-sound.wav' 
    },
    // circle, rectangle, etc, anchored to a tile or token
    projectionRegion: {
        
    },
    // if not canLoop, isPlaying autosets to false after the soundFile finished
    canLoop: {
        type: Boolean,
        required: true,
        default: true
    },
    // if set to false it stops playing, if set to true it starts playing from the begininng of the file
    isPlaying: {
        type: Boolean,
        required: true,
        default: false
    },
    // bypasses projection region and anchor
    isGlobal: {
        type: Boolean,
        required: true,
        default: true
    },
    // filter
    whitelist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }],
    blacklist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }],
    assignedMap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map'
    }
}, { timestamps: true });