import { Video } from '../models/video.model.js';
import { Subscription } from '../models/subscription.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getChannelStats = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const videos = await Video.find({ owner: user._id });
        if (!videos) {
            throw new ApiError(400, 'videos not found');
        }
        const subscribers = await Subscription.find({ channel: user._id });
        if (!subscribers) {
            throw new ApiError(400, 'subscribers not found');
        }
        let totalViews = 0;
        videos.map((video) => {
            totalViews += video.views;
        });
        const totalVideos = videos.length;
        const totalSubscribers = subscribers.length;

        const stats = {
            totalVideos,
            totalViews,
            totalSubscribers,
        };
        return res
            .status(200)
            .json(new ApiResponse(200, stats, 'stats fetched successfully'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching stats'
        );
    }
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page);
        const pageSize = parseInt(limit);
        const user = req.user;
        // Construct query filter
        var aggregate = Video.aggregate([
            {
                $match: {
                    owner: user._id,
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
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching videos'
        );
    }
});

export { getChannelStats, getChannelVideos };
