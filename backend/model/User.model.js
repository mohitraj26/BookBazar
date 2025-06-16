import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({  // make a new instance of schema
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    role: {
        type: String,
        enum: ["user","admin"], // select from this array
        default: "user"
    },

    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },

    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },

    lastLogin: Date
},{
    timestamps: true,
}) 

userSchema.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

const User = mongoose.model("User",userSchema)

export default User