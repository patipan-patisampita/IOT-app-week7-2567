import express from 'express'
import { protectedRoute } from '../middleware/authMiddleware.js'
import multer from 'multer'
import path from 'path'
import User from '../models/userModel.js'
import Post from '../models/postModel.js'

const router = express.Router()

//set up storage engine using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//initialize upload variable with the storage engine
const upload = multer({ storage: storage })

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

//handle create new post request
router.post('/create-post', protectedRoute, upload.single('image'), async function (req, res) {
    try {
        const title = req.body.title
        const content = req.body.content
        const image = req.file.filename
        const slug = title.replace(/\s+/g, '_').toLowerCase()

        const user = await User.findById(req.session.user._id)

        //create new post
        const post = new Post({ title, content, slug, image, user })

        //Save post in user posts object
        await User.updateOne({ _id: req.session.user._id }, { $push: { posts: post.id } })

        await post.save()
        req.flash('success', 'Post created successfully!')
        return res.redirect('/posts')

    } catch (error) {
        console.error(error)
        req.flash('error', 'Something went wrong.try again!')
        return req.redirect('/create-post')
    }
})

export default router