
let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true
    }
})

// mongoose.model("User", userSchema);
module.exports = mongoose.model("User", userSchema);