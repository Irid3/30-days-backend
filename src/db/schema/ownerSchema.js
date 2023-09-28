import mongoose, { Schema, Document } from 'mongoose';

export const SchemaOwner = new Schema(
    {
        id: String,
        name: String,
        email: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model('owner', SchemaOwner);
