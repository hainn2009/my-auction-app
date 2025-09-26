import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoginDocument = Login & Document;

@Schema()
export class Login {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop()
    ipAddress: string;

    @Prop()
    userAgent: string;

    @Prop({
        type: {
            country: String,
            region: String,
            city: String,
            isp: String,
        },
    })
    location: {
        country?: string;
        region?: string;
        city?: string;
        isp?: string;
    };

    @Prop({ type: Date, default: Date.now, expires: 15778463 })
    loginAt: Date;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
