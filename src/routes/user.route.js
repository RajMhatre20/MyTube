import { Router } from 'express';
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 },
    ]),
    registerUser
);

router.route('/login').post(loginUser);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router
    .route('/update-user-avatar')
    .post(
        verifyJWT,
        upload.fields([{ name: 'avatar', maxCount: 1 }]),
        updateUserAvatar
    );
router
    .route('/update-user-cover-image')
    .post(
        verifyJWT,
        upload.fields([{ name: 'coverImage', maxCount: 1 }]),
        updateUserCoverImage
    );
router.route('/update-account-details').post(verifyJWT, updateAccountDetails);

export default router;
