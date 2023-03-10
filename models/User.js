const { Schema, model } = require('mongoose');
const { thoughtSchema, Thought } = require('../models/Thought')
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/,
            unique: true,
        },
        thoughts: [thoughtSchema],
        friends: [],
    },
    {
        toJSON: { getters: true },
        id: false
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;