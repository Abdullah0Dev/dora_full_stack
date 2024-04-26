/** 
    getAllPosts,
    getAPost,
    createAPost,
    deleteAPost,
    updateAPost
 */
const mongoose = require('mongoose');
const Dora = require('../models/DoraModel')
// get all posts
const getAllPosts = async (req, res) => {
    try {
        // initialize
        const AllDora = await Dora.find().sort({ createdAt: -1 })
        // send response
        res.status(200).json(AllDora)
    } catch (error) {
        res.status(404).json('NO Post Found', error.message)
    }
}
// get a post
const getAPost = async (req, res) => {
    // get the id
    const { id } = req.params
    try {
        // check if the id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No such ID' })
        }
        // get the post
        const getADora = await Dora.findById(id);
        if (!getADora) {
            res.status(400).json(`Not Valid Post`);
        }
        // send response
        res.status(200).json(getADora)

    } catch (error) {
        res.status(404).json('No Post Found', error.message)
    }
}
// create a post
// create a post
// create a post
const createAPost = async (req, res) => {
    try {
        // input fields
        const { title, prompt, video, thumbnail, creator } = req.body;
        const { name, email, avatar } = creator; // Destructure username and avatar from creator object
        // initialization
        const createPost = await Dora.create({ title, prompt, video, thumbnail, creator: { name, email, avatar } });
        //  check if the post is valid
        if (!createPost) {
            return res.status(400).json({ error: 'Failed to create post. Please try again.' });
        }
        // send response
        return res.status(200).json(createPost);
    } catch (error) {
        console.error("Error Creating Post:", error.message);
        let errorMessage = '';
        if (error.errors) {
            errorMessage = Object.values(error.errors).map(error => error.message).join(', ');
        } else {
            errorMessage = error.message;
        }
        res.status(500).json({ message: errorMessage });
    }
}


// delete a post
const deleteAPost = async (req, res) => {
    try {
        const { id } = req.params;
        // check if the id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletePost = await Dora.findByIdAndDelete({ _id: id });
        // check if deletePost is null, indicating no post was found with that ID
        if (!deletePost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Successful deletion
        return res.status(200).json(deletePost);
    } catch (error) {
        // Catch any unexpected errors
        console.error("Error deleting post:", error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
}

// update a post
const updateAPost = async (req, res) => {
    try {
        const { id } = req.params;
        // check if the id is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'No such ID' })
        }
        const updatePost = await Dora.findByIdAndUpdate({ id: _id }, { ...req.body }, { new: true })
        if (!updatePost) {
            res.status(400).json(`Not Valid Post`);
        }
        // return the response
        res.status(200).json(updatePost);
    } catch (error) {
        res.status(404).json('Can not update the post', error.message)

    }
}


module.exports = {
    getAllPosts,
    getAPost,
    createAPost,
    deleteAPost,
    updateAPost
}