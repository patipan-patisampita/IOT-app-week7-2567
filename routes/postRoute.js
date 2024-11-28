import express from 'express'
import { protectedRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

//route for posts page
router.get('/posts', protectedRoute, (req, res) => {
    return res.render('posts/index', { title: 'Post Page', active: 'posts' })
})

//route for create new posts page
router.get('/create-post', protectedRoute, (req, res) => {
    return res.render('posts/create-post', { title: "Create post", active: 'create_post' })
})

//route for edit posts page
router.get('/edit-post/:id', protectedRoute, (req, res) => {
    return res.render('posts/edit-post', { title: 'Edit Post', active: 'edit_post' })
})

//route for view posts page
router.get('/post/:id', (req, res) => {
    return res.render('posts/view-post', { title: 'View Post', active: 'view_post' })
})

export default router