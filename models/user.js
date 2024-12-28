const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose);//automatically adds username and hashing and salting , we don't need to built it from scratch.

module.exports = mongoose.model("User", userSchema)