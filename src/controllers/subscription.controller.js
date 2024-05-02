import { Subscription } from '../models/subscription.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const toggleSubscription = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        const user = req.user;

        if (!channelId) {
            throw new ApiError(401, 'channelId not found');
        }
        const isSubcribed = await Subscription.findOne({
            subscriber: user._id,
            channel: channelId,
        });

        let subcribe;
        if (isSubcribed) {
            subcribe = await Subscription.deleteOne({ _id: isSubcribed._id });
        } else {
            subcribe = await Subscription.create({
                subscriber: user._id,
                channel: channelId,
            });
        }

        return res
            .status(201)
            .json(new ApiResponse(201, subcribe, 'Subscription toggled'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while toggling subcription'
        );
    }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params;
        if (!channelId) {
            throw new ApiError(401, 'channelId not found');
        }
        const subscribers = await Subscription.find({
            channel: channelId,
        });

        if (!subscribers) {
            throw new ApiError(401, 'Subscription not found');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    subscribers,
                    'Subscription fetched successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching subscription'
        );
    }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params;

        if (!subscriberId) {
            throw new ApiError(401, 'subscriberId not found');
        }
        const subscribers = await Subscription.find({
            subscriber: subscriberId,
        });

        if (!subscribers) {
            throw new ApiError(401, 'subscribers not found');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    subscribers,
                    'Subscribers fetched successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching subscribers'
        );
    }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
