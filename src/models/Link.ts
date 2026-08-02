import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILink extends Document {
    title: string;
    url: string;
    description: string;
    createdAt: Date;
}

const LinkSchema: Schema = new Schema({
    title: { type: String, required: [true, 'O nome do botão é obrigatório'] },
    url: { type: String, required: [true, 'A URL é obrigatória'] },
    description: { type: String, required: [true, 'A descrição é obrigatória'] },
    createdAt: { type: Date, default: Date.now },
});

const Link: Model<ILink> = mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;