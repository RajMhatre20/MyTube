import mongoose from 'mongoose';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteOnCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, userId } = req.query;
    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);

    try {
        // Construct query filter
        var aggregate = Video.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId),
                    title: { $regex: query, $options: 'i' },
                },
            },
        ]);

        // Query the database
        const options = {
            page: pageNum,
            limit: pageSize,
        };

        const videos = await Video.aggregatePaginate(aggregate, options);

        return res
            .status(200)
            .json(new ApiResponse(200, videos, 'videos fetched successfully'));
    } catch (error) {
        throw new ApiError(404, 'Error while fetching videos');
    }
});

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        const { title, description } = req.body;
        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
        if (!thumbnailLocalPath) {
            throw new ApiError(400, 'Thumbnail is required');
        }

        const videoFileLocalPath = req.files?.videoFile[0]?.path;
        if (!videoFileLocalPath) {
            throw new ApiError(400, 'Video is required');
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        const videoFile = await uploadOnCloudinary(videoFileLocalPath);

        if (!thumbnail) {
            throw new ApiError(400, 'thumbnail cloudinary file is required');
        }

        if (!videoFile) {
            throw new ApiError(400, 'videoFile cloudinary file is required');
        }

        const video = await Video.create({
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            title,
            description,
            duration: videoFile.duration,
            owner: req.user,
        });

        return res
            .status(201)
            .json(new ApiResponse(201, video, 'video uploaded sucessfully'));
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while uploading video');
    }
});

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }
        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(400, 'Video not found');
        }
        return res
            .status(201)
            .json(new ApiResponse(201, video, 'video found sucessfully'));
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while fetching video');
    }
});

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }
        const { title, description } = req.body;
        const thumbnailLocalPath = req.file?.path;

        if (!(title || description || thumbnailLocalPath)) {
            return new ApiError(400, 'Atleast one field is required');
        }

        const video = await Video.findById({ _id: videoId });
        if (!video) {
            throw new ApiError(401, 'video not found');
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to update this video'
            );
        }

        var thumbnail;
        if (thumbnailLocalPath) {
            thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        }

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    title,
                    description,
                    thumbnail: thumbnail.url,
                },
            },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedVideo, 'video updated successfuly')
            );
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while updating video');
    }
});

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }
        const video = await Video.findById({ _id: videoId });
        if (!video) {
            throw new ApiError(401, 'video not found');
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to delete this video'
            );
        }

        await deleteOnCloudinary(video.url);
        await Video.deleteOne({ _id: videoId });
        return res
            .status(200)
            .json(new ApiResponse(200, 'Video deleted successfully'));
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while deleting the video'
        );
    }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }

        const video = await Video.findById({ _id: videoId });
        if (!video) {
            throw new ApiError(401, 'video not found');
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to update this video'
            );
        }
        const isPublished = video?.isPublished;
        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {
                $set: {
                    isPublished: !isPublished,
                },
            },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedVideo,
                    'Published status updated successfuly'
                )
            );
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while updating published status'
        );
    }
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
