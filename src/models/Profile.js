import mongoose, { Schema } from "mongoose";
import UserModel from "./users";

const profileSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true,
        validate: {
            validator: async function (username) {
                const profile = await this.constructor.findOne({username: username});
                if(profile){
                    if(profile._id.toString() === this._id.toString())
                        return true;
                    return false;
                }
                return true;
            },
            message: props => `${props.value} is already taken by someone`
        }
    },
    fullname: {
        type: String,
        required: [true, "Fullname is required"],
        trim: true,
    },
    dob: {
        type: Date,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    avatar_url: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female'],
            message: "Invalid Value"
        },
        required: false
    },
    user_id: {
        type: Schema.ObjectId,
        ref: "USERS",
        required: [true, "User ID is required"],
        unique: true,
        validate: {
            validator: async function (user_id){
                const user = await UserModel.findById(user_id);
                return !!user;
            },
            message:"User with this ID does not exist",
        }
    }
})

const profileModel =  mongoose.models.PROFILES || mongoose.model("PROFILES", profileSchema);
export default profileModel;