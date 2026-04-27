import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    game_master: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
}, { timestamps: true });

CampaignSchema.statics.fetch_by_gm = async function (userID) {
    return await this.find({ game_master: userID });
};

CampaignSchema.statics.fetch_by_player = async function (userID) {
    return await this.find({ players: userID });
};

CampaignSchema.methods.add_player = function (userID) {
    this.players.addToSet(userID);
};

CampaignSchema.methods.remove_player = function (userID) {
    this.players.pull(userID);
};

CampaignSchema.methods.has_player = function (userID) {
    return this.players.some(id => id.equals(userID));
};

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
export default Campaign;