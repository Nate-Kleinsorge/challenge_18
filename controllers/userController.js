const { User, Thought } = require('../models');

module.exports = {
    //get all users
    getUsers(req, res) {
        User.find()
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err));
    },
    //find user based on ID
    getOneUser(req, res) { 
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => {
                if (!user) {
                    res.status(400).json({ message: 'No user with that ID' })
                } else {
                    res.status(200).json(user)
                }
            })
            .catch((err) => res.status(500).json(err));
    },
    //post a user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.status(200).json(user))
            .catch((err) => res.status(500).json(err));
    },
    //update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body }, 
            { new: true }
        )
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'no user with that id' })
            } else {
                res.status(200).json(user)
            }
        })
        .catch((err) => res.status(500).json(err));
    },
    //Delete a user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => {
                if (!user) {
                    res.status(400).json({ message: 'No user with that id' })
                } else {
                    Thought.deleteMany({ _id: { $in: user.thoughts } })
                }
            })
            .then(() => res.json({ message: 'User and associated friends, and thoughts deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { new: true }
        )
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'No user with that id' })
            } else {
                res.status(200).json(user)
            }
        })
        .catch((err) => res.status(500).json(err))
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { friendId: req.params.friendId } } },
            { new: true }
        )
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'no user with that id' })
            } else {
                res.status(200).json(user)
            }
        })
        .catch((err) => res.status(500).json(err));
    }
};