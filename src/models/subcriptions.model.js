import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const subcriptionSchema = new Schema(
    {
        subcriber: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

export const Subcription = mongoose.Model('Subcription', subcriptionSchema);
