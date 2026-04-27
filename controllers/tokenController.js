import Token from "../models/token.js";

const create_token = async (req, res) => {
    try {
        const newToken = new Token(req.body);
        await newToken.save(); // Fixed typo
        return res.status(201).json(newToken);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const update_token = async (req, res, next) => {
    const { token_id, ...updates } = req.body;
    Object.assign(req.token, updates); 
    next();
};

const delete_token = async (req, res) => {
    await req.token.deleteOne(); 
    return res.status(200).json({ message: "Deleted successfully" });
};

const view_token = async (req, res, next) => {
    const { token_id } = req.params; // Usually a GET request
    const token = await Token.findById(token_id).populate('owners', 'username');
    
    if (!token) return res.status(404).json({ error: "Token not found" });
    return res.status(200).json(token);
};

const rename_token = async (req, res, next) => {
    const { name, update=true } = req.body;
    
    req.token.rename(name);
    next();
};

const add_target = async (req, res, next) => {
    const { target_token_id, update=true } = req.body;
    
    req.token.add_target(target_token_id);
    next();
};

const remove_target = async (req, res, next) => {
    const { target_token_id, update=true } = req.body;
    
    req.token.remove_target(target_token_id);
    next();
};

const reset_targets = async (req, res, next) => {
    const { update=true } = req.body;

    req.token.reset_targets();
    next();
};

const add_owner = async (req, res, next) => {
    const { owner_id, update=true } = req.body;
    
    req.token.add_owner(owner_id);
    next();
};

const remove_owner = async (req, res, next) => {
    const { owner_id, update=true } = req.body;
    
    req.token.remove_owner(owner_id);
    next();
};

const move_token = async (req, res, next) => {
    const { x=0, y=0, z=0, update=true } = req.body;
    
    req.token.offset_position(x, y, z);
    next();
};

const set_token_position = async (req, res, next) => {
    const { x=0, y=0, z=0, update=true } = req.body;
    
    req.token.set_position(x, y, z);
    next();
};

const reset_token_position = async (req, res, next) => {
    const { update=true } = req.body;

    req.token.reset_position();
    next();
};

const rotate_token = async (req, res, next) => {
    const { rotation=0.0, update=true } = req.body;
    
    req.token.offset_rotation(rotation);
    next();
};

const set_token_rotation = async (req, res, next) => {
    const { rotation=0.0, update=true } = req.body;

    req.token.set_rotation(rotation);
    next();
};

const reset_token_orientation = async (req, res, next) => {
    const { update=true } = req.body;

    req.token.reset_orientation(rotation);
    next();
};

const flip_token = async (req, res, next) => {
    const { update=true } = req.body;
    
    req.token.flip();
    next();
};

// Ensure DB is updated
const refresh_token = async (req, res, next) => {
    await req.req.token.save();
    // SSE invocation -> new flip state
    return res.status(200).json(req.token);
};

export default {
    create_token,
    update_token,
    view_token,
    rename_token,
    delete_token,
    add_target,
    remove_target,
    reset_targets,
    add_owner,
    remove_owner,
    move_token,
    set_token_position,
    reset_token_position,
    rotate_token,
    set_token_rotation,
    reset_token_orientation,
    flip_token, 
    refresh_token
};