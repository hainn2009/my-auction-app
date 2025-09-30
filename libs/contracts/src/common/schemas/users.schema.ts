import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    avatar?: string;

    @Prop({ enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Prop()
    ipAddress?: string;

    @Prop()
    userAgent?: string;

    @Prop({
        type: {
            country: { type: String },
            region: { type: String },
            city: { type: String },
            isp: { type: String },
        },
    })
    location?: {
        country?: string;
        region?: string;
        city?: string;
        isp?: string;
    };

    @Prop({ type: Date, default: Date.now })
    signupAt: Date;

    @Prop({ type: Date, default: Date.now })
    lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
