import mongoose, { Schema } from "mongoose";
import {randomUUID} from "crypto";

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        validate: {
            validator: async function (email) {
                const user = await this.constructor.findOne({ email: email });
                if (user) {
                    if(this._id.toString() === user._id.toString())
                        return true;
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is already in use`
        }
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    token: {
        type: Schema.Types.UUID,
        trim: true,
        default: ()=> randomUUID(),
    },
    token_expires_at: {
        type: Date,
        default: ()=>Date.now() + 24*60*60*1000,
        required: true
    }
})

const userModel =  mongoose.models.USERS || mongoose.model("USERS", userSchema);
export default userModel;