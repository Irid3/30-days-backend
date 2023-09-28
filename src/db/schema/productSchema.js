import mongoose, { Schema, Document } from 'mongoose';

export const SchemaProduct = new Schema(
    {
        id: String,
        title: String,
        description: String,
        price: Number,
        categoryId: String,
        ownerId: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model('product', SchemaProduct);
