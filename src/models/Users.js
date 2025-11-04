import mongoose, { Schema } from "mongoose";

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
})

const userModel =  mongoose.models("USERS") || mongoose.model("USERS", userSchema);
export default userModel;