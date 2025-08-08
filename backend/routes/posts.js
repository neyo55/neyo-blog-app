const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const router = express.Router();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    if (token === 'demo-token') {
      req.userId = '6893646d0a743246a7777ee2'; // Use the ObjectId from seedDemoUser.js
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9, search = '', category = '' } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    const posts = await Post.find(query)
      .populate('author', 'name')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Post.countDocuments(query);
    res.json({ posts, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'author', select: 'name' },
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  try {
    const post = new Post({ title, content, category, author: req.userId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Post save error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    post.title = title;
    post.content = content;
    post.category = category;
    post.updatedAt = new Date();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    await post.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const comment = new Comment({
      content,
      author: req.userId,
      postId: req.params.id,
      parentId: parentId || null,
    });
    await comment.save();
    const updatedPost = await Post.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'author', select: 'name' },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    comment.content = content;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id/comments/:commentId', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
    await comment.deleteOne();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;









// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const Post = require('../models/Post');
// const Comment = require('../models/Comment');
// const router = express.Router();

// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token provided' });
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// router.get('/', async (req, res) => {
//   try {
//     const { page = 1, limit = 9, search = '', category = '' } = req.query;
//     const query = {};
//     if (search) query.title = { $regex: search, $options: 'i' };
//     if (category) query.category = category;
//     const posts = await Post.find(query)
//       .populate('author', 'name')
//       .skip((page - 1) * limit)
//       .limit(Number(limit));
//     const total = await Post.countDocuments(query);
//     res.json({ posts, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id).populate('author', 'name');
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     const comments = await Comment.find({ postId: req.params.id, parentId: null })
//       .populate('author', 'name')
//       .lean();
//     const populateReplies = async (comment) => {
//       comment.replies = await Comment.find({ parentId: comment._id })
//         .populate('author', 'name')
//         .lean();
//       for (const reply of comment.replies) {
//         await populateReplies(reply);
//       }
//     };
//     for (const comment of comments) {
//       await populateReplies(comment);
//     }
//     res.json({ ...post.toObject(), comments });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/', authMiddleware, async (req, res) => {
//   const { title, content, category } = req.body;
//   if (!title || !content) {
//     return res.status(400).json({ message: 'Title and content are required' });
//   }
//   try {
//     const post = new Post({ title, content, category, author: req.userId });
//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.put('/:id', authMiddleware, async (req, res) => {
//   const { title, content, category } = req.body;
//   if (!title || !content) {
//     return res.status(400).json({ message: 'Title and content are required' });
//   }
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
//     post.title = title;
//     post.content = content;
//     post.category = category;
//     post.updatedAt = new Date();
//     await post.save();
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     if (post.author.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });
//     await post.deleteOne();
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.post('/:id/comments', authMiddleware, async (req, res) => {
//   try {
//     const { content, parentId } = req.body;
//     const comment = new Comment({
//       content,
//       author: req.userId,
//       postId: req.params.id,
//       parentId: parentId || null,
//     });
//     await comment.save();
//     res.status(201).json(comment);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;