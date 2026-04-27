import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String, 
        default: 'default-token.png' 
    },
    size: {
        type: Number,
        required: true
    },
    x: { 
        type: Number,
        required: true,
        default: 0.0
    },
    y: { 
        type: Number,
        required: true,
        default: 0.0
    },
    z: { // height
        type: Number,
        required: true,
        default: 0.0
    },
    rotation: { 
        type: Number,
        required: true,
        default: 0.0
    },
    isFlipped: { 
        type: Boolean,
        required: true,
        default: false
    },
    owners: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    targets: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Token'
    }]
}, { timestamps: true });

TokenSchema.index({ createdAt: -1 });

TokenSchema.methods.rename = function(user_id, name) {
    this.name = name;
}

TokenSchema.methods.offset_position = function(x=0, y=0, z=0) {
    this.x += x;
    this.y += y;
    this.z += z;
}

TokenSchema.methods.set_position = function(x=0, y=0, z=0) {
    this.x = x;
    this.y = y;
    this.z = z;
}

TokenSchema.methods.reset_position = function() {
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;
}

TokenSchema.methods.snap_position = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
}

TokenSchema.methods.offset_rotation = function(rotation) {
    this.rotation = (this.rotation + rotation) % 360;
}

TokenSchema.methods.set_rotation = function(rotation=0.0) {
    this.rotation = rotation % 360;
}

TokenSchema.methods.snap_rotation = function() {
    this.rotation = Math.round(this.rotation / 90) * 90;
}

TokenSchema.methods.reset_orientation = function() {
    this.rotation = 0.0;
    this.isFlipped = false;
}

TokenSchema.methods.flip = function() {
    this.isFlipped = !this.isFlipped;
}

TokenSchema.methods.add_owner = function(ownerID) {
    this.owners.addToSet(ownerID);
}

TokenSchema.methods.remove_owner = function(ownerID) {
    this.owners.pull(ownerID);
}

TokenSchema.methods.has_ownership = function (ownerID) {
    return this.owners.some(id => id.equals(ownerID));
};

TokenSchema.methods.add_target = function (tokenID) {
    this.targets.addToSet(tokenID);
};

TokenSchema.methods.remove_target = function (tokenID) {
    this.targets.pull(tokenID);
};

TokenSchema.methods.reset_targets = function () {
    this.targets.clear();
};

TokenSchema.methods.is_targeting = function (tokenID) {
    return this.targets.some(id => id.equals(tokenID));
};

const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);
export default Token;