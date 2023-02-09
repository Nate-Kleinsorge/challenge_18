const e = require('express');
const { User } = require('../models');
const { Thought } = require('../models/Thought');

module.exports = {
    //get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.status(200).json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    //get a single thought
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({ message: 'No thought with that id' })
                } else {
                    res.status(200).json(thought)
                }
            })
            .catch((err) => res.status(500).json(err));
    },
    //post a new thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { userId: req.body.userId },
                    { $addToSet: { thoughts: thought } },
                    {new: true},
                );
            })
            .then((user) => {
                if (!user) { 
                    res.status(400).json({ message: 'thought created, but no user with that id' })
                } else {
                    res.status(200).json({ message: 'Created the Thought' })
                }
            })
            .catch((err) => res.status(500).json(err))
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true }
        ).then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'no thought with this id' })
            } else {
                res.status(200).json(thought)
            }
        })
        .catch((err) => res.status(500).json(err));
    },
    //delete a thought based on id
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({ message: 'No Thought with that id' })
                } else { 
                    User.findOneAndUpdate(
                        { _id: thought.body.userId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                    )
                }
            })
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this id' })
                } else {
                    res.status(200).json({ message: 'Thought deleted successfully' })
                }
            })
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true }
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'no thought with this id' })
            } else {
                res.status(200).json(thought)
            }
        })
        .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        )
        .then((thought) => {
            if (!thought) {
                res.status(404).json({ message: 'no thought with this id' })
            } else {
                res.status(200).json(thought)
            }
        })
        .catch((err) => res.status(500).json(err));
    },
}