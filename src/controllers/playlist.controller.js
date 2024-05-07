import mongoose, { isValidObjectId } from 'mongoose';
import { Playlist } from '../models/playlist.model.js';
import { Video } from '../models/video.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            throw new ApiError(401, 'Name not found');
        }

        const user = req.user;

        const playlist = await Playlist.create({
            name,
            description,
            owner: user._id,
        });

        if (!playlist) {
            throw new ApiError(401, 'Error while creating playlist');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, playlist, 'Playlist created successfully')
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while creating playlist'
        );
    }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            throw new ApiError(401, 'userId not found');
        }

        const userPlaylist = await Playlist.find({ owner: userId });

        if (!userPlaylist) {
            throw new ApiError(401, 'Error while fetching playlist');
        }
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    userPlaylist,
                    'Playlist fetched successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while fetching playlist'
        );
    }
});

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        if (!playlistId) {
            throw new ApiError(401, 'playlistId not found');
        }

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(401, 'playlist not found');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, playlist, 'Playlist fetched successfully')
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while creating playlist'
        );
    }
    //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;
        const user = req.user;

        if (!playlistId) {
            throw new ApiError(401, 'playlistId not found');
        }
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(401, 'video not found');
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(401, 'playlist not found');
        }

        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to add video to this playlist'
            );
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $push: {
                    videos: video,
                },
            },
            { new: true }
        );

        if (!updatedPlaylist) {
            throw new ApiError(401, 'Error while adding video to playlist');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    updatedPlaylist,
                    'Video added to playlist successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message ||
                'something went wrong while adding video to playlist'
        );
    }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;
        const user = req.user;

        if (!playlistId) {
            throw new ApiError(401, 'playlistId not found');
        }
        if (!videoId) {
            throw new ApiError(401, 'videoId not found');
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(401, 'playlist not found');
        }

        if (!playlist.videos.includes(new mongoose.Types.ObjectId(videoId))) {
            throw new ApiError(401, 'video does not exists in playlist');
        }

        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to remove video from this playlist'
            );
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: {
                    videos: videoId,
                },
            },
            { new: true }
        );

        if (!updatedPlaylist) {
            throw new ApiError(401, 'Error while removing video to playlist');
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    updatedPlaylist,
                    'Video removed to playlist successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message ||
                'something went wrong while removing video to playlist'
        );
    }
});

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        const user = req.user;

        if (!playlistId) {
            throw new ApiError(401, 'playlistId not found');
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(401, 'playlist not found');
        }

        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to delete this playlist'
            );
        }

        await Playlist.deleteOne({ _id: playlist._id });
        return res
            .status(201)
            .json(new ApiResponse(201, 'playlist deleted successfully'));
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while deleting playlist'
        );
    }
});

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { name, description } = req.body;
        const user = req.user;

        if (!playlistId) {
            throw new ApiError(401, 'playlistId not found');
        }

        if (!(name || description)) {
            throw new ApiError(401, 'atleast one is required for updatation');
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(401, 'playlist not found');
        }

        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(
                401,
                'You are not authorized to update this playlist'
            );
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlist,
            {
                $set: {
                    name,
                    description,
                },
            },
            { new: true }
        );
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    updatedPlaylist,
                    'playlist updated successfully'
                )
            );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || 'something went wrong while updating playlist'
        );
    }
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
