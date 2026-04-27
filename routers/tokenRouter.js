import express from "express";
import controller from '../controllers/tokenController.js';
import Token from "../models/token.js";

const verify_ownership = async (req, res, next) => {
    try {
        const { token_id, user_id } = req.body;
        
        const token = await Token.findById(token_id);
        if (!token) return res.status(404).json({ error: "Token not found" });

        if (token.has_ownership(user_id)) {
            req.token = token; 
            return next();
        }
        
        return res.status(403).json({ error: "Not owner of token" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const apply_change = async (req, res) => {
    try {
        const { apply = true } = req.body;
        if (apply) await req.token.save();
        return res.status(200).json(req.token);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const router = express.Router();

router.post('/create_token', controller.create_token);
router.post('/update_token', verify_ownership, controller.update_token);
router.get('/view_token', controller.view_token);
router.post('/rename_token', verify_ownership, controller.rename_token, apply_change);
router.post('/delete_token', verify_ownership, controller.delete_token);
router.post('/add_target', verify_ownership, controller.add_target, apply_change);
router.post('/remove_target', verify_ownership, controller.remove_target, apply_change);
router.post('/reset_targets', verify_ownership, controller.reset_targets, apply_change);
router.post('/add_owner', verify_ownership, controller.add_owner, apply_change);
router.post('/remove_owner', verify_ownership, controller.remove_owner, apply_change);
router.post('/move_token', verify_ownership, controller.move_token, apply_change);
router.post('/set_token_position', verify_ownership, controller.set_token_position, apply_change);
router.post('/reset_token_position', verify_ownership, controller.reset_token_orientation, apply_change);
router.post('/rotate_token', verify_ownership, controller.rotate_token, apply_change);
router.post('/set_token_rotation', verify_ownership, controller.set_token_rotation, apply_change);
router.post('/reset_token_orientation', verify_ownership, controller.reset_token_orientation, apply_change);
router.post('/flip_token', verify_ownership, controller.flip_token, apply_change); 
router.post('/refresh_token', verify_ownership, controller.refresh_token);

export default router;