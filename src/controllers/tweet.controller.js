import { Tweet } from '../models/tweet.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createTweet = asyncHandler(async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.length === 0) {
            throw new ApiError(404, 'Tweet should have content');
        }

        const user = req.user;
        if (!user) {
            throw new ApiError(404, 'User does not exist');
        }

        const createdTweet = await Tweet.create({
            content: content,
            owner: user,
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, createdTweet, 'Tweet posted successfully')
            );
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while creating tweet');
    }
});

const getUserTweets = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, 'User does not exist');
    }

    const Tweets = await Tweet.find({
        owner: user,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, Tweets, 'Tweet fetched successfully'));
});

const updateTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId, content } = req.body;
        if (!tweetId || !content) {
            throw new ApiError(401, 'TweetId or content not found');
        }

        const tweet = await Tweet.findById({ _id: tweetId });

        if (!tweet) {
            throw new ApiError(401, 'Tweet not found');
        }

        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to update this tweet'
            );
        }

        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { $set: { content: content } },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, updatedTweet, 'Tweet updated successfully')
            );
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while upadting the tweet'
        );
    }
});

const deleteTweet = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.body;
        if (!tweetId) {
            throw new ApiError(401, 'TweetId not found');
        }

        const tweet = await Tweet.findById({ _id: tweetId });

        if (!tweet) {
            throw new ApiError(401, 'Tweet not found');
        }

        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to delete this tweet'
            );
        }

        await Tweet.deleteOne({ _id: tweetId });

        return res
            .status(200)
            .json(new ApiResponse(200, 'Tweet deleted successfully'));
    } catch (error) {
        throw new ApiError(
            500,
            'Something went wrong while deleting the tweet'
        );
    }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
