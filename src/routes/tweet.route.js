import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from '../controllers/tweet.controller.js';

const router = Router();

// Secured routes
router.route('/create-tweet').post(verifyJWT, createTweet);
router.route('/get-tweets').get(verifyJWT, getUserTweets);
router.route('/update-tweet').patch(verifyJWT, updateTweet);
router.route('/delete-tweet').delete(verifyJWT, deleteTweet);

export default router;
