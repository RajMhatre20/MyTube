import mongoose from 'mongoose';
import { Comment } from '../models/comment.model.js';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);

    try {
        // Construct query filter
        var aggregate = Comment.aggregate([
            {
                $match: {
                    video: new mongoose.Types.ObjectId(videoId),
                },
            },
        ]);

        // Query the database
        const options = {
            page: pageNum,
            limit: pageSize,
        };

        const comments = await Comment.aggregatePaginate(aggregate, options);

        return res
            .status(200)
            .json(
                new ApiResponse(200, comments, 'Commnets fetched successfully')
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching comments'
        );
    }
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    try {
        const { videoId } = req.params;
        const { content } = req.body;
        const user = req.user;

        if (!videoId) {
            throw ApiError(400, 'VideoId is required');
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, 'Video does not exist');
        }

        if (!content) {
            throw ApiError(400, 'comment is required');
        }

        const comment = await Comment.create({
            content,
            owner: user._id,
            video: videoId,
        });

        if (!comment) {
            throw new ApiError(401, 'Could not create comment');
        }

        res.status(200).json(
            new ApiResponse(200, comment, 'Comment created successfully')
        );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while adding comment'
        );
    }
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const user = req.user;

        if (!commentId) {
            throw ApiError(400, 'commentId is required');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, 'comment does not exist');
        }

        if (!content) {
            throw ApiError(400, 'comment is required');
        }

        if (comment.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to update this comment'
            );
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    content,
                },
            },
            { new: true }
        );
        if (!updatedComment) {
            throw new ApiError(401, 'Could not update comment');
        }

        res.status(200).json(
            new ApiResponse(200, updatedComment, 'Comment updated successfully')
        );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while updating comment'
        );
    }
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    try {
        const { commentId } = req.params;
        const user = req.user;

        if (!commentId) {
            throw ApiError(400, 'commentId is required');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            throw new ApiError(404, 'comment does not exist');
        }

        if (comment.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to delete this comment'
            );
        }

        await Comment.deleteOne({ _id: commentId });

        res.status(200).json(
            new ApiResponse(200, 'Comment deleted successfully')
        );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while deleting comment'
        );
    }
});

export { getVideoComments, addComment, updateComment, deleteComment };
