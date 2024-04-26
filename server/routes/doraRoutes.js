const express = require('express')
const {

    getAllPosts,
    getAPost,
    createAPost,
    deleteAPost,
    updateAPost
}
    = require('../controllers/doraController')


const router = express.Router()

// get all posts
router.get('/', getAllPosts);
// get a single posts by its id;
router.get('/:id', getAPost);
// create a new post
router.post('/', createAPost);
// delete a post by its id
router.delete('/:id', deleteAPost);
// update a post by its id
router.put('/:id', updateAPost);

module.exports = router;