import mongoose, { isValidObjectId } from 'mongoose';
import { Like } from '../models/like.model.js';
import { Video } from '../models/video.model.js';
import { Comment } from '../models/comment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Tweet } from '../models/tweet.model.js';

const toggleVideoLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        const user = req.user;

        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, 'Video not found');
        }

        const isLiked = await Like.findOne({
            likedBy: user._id,
            video: videoId,
        });

        let liked;
        if (isLiked) {
            liked = await Like.deleteOne({ _id: isLiked._id });
        } else {
            liked = await Like.create({
                video: video._id,
                likedBy: user._id,
            });
        }
        return res
            .status(201)
            .json(new ApiResponse(201, liked, 'Video liked toggled'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while toggling video like'
        );
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;
        const user = req.user;

        if (!commentId) {
            throw new ApiError(401, 'commentId not found');
        }
        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(400, 'Comment not found');
        }

        const isLiked = await Like.findOne({
            likedBy: user._id,
            comment: commentId,
        });

        let liked;
        if (isLiked) {
            liked = await Like.deleteOne({ _id: isLiked._id });
        } else {
            liked = await Like.create({
                comment: comment._id,
                likedBy: user._id,
            });
        }
        return res
            .status(201)
            .json(new ApiResponse(201, liked, 'Comment liked toggled'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while toggling comment like'
        );
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params;
        const user = req.user;

        if (!tweetId) {
            throw new ApiError(401, 'tweetId not found');
        }
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new ApiError(400, 'tweet not found');
        }

        const isLiked = await Like.findOne({
            likedBy: user._id,
            tweet: tweetId,
        });

        let liked;
        if (isLiked) {
            liked = await Like.deleteOne({ _id: isLiked._id });
        } else {
            liked = await Like.create({
                tweet: tweet._id,
                likedBy: user._id,
            });
        }
        return res
            .status(201)
            .json(new ApiResponse(201, liked, 'Tweet liked toggled'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while toggling tweet like'
        );
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    try {
        const user = req.user;

        const likedVideos = await Like.find({
            likedBy: user._id,
            video: { $ne: null },
        });
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    likedVideos,
                    'Liked videos fetched successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching liked videos'
        );
    }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
