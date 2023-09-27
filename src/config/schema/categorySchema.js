import mongoose, { Schema, Document } from 'mongoose';

export const SchemaCategory = new Schema(
    {
        id: String,
        title: String,
        description: String,
        ownerId: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model('category', SchemaCategory);
