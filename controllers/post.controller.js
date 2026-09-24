const {
  createPost,
  getAllPostsAndComments,
  updatePost,
  deletePost,
} = require("../services/post.service.js");

async function getBlogPosts(req, res, next) {
  try {
    const posts = await getAllPostsAndComments();

    return res.status(200).json({
      posts,
    })
    
  } catch (err) {
    next(err);
  }
}

async function createNewBlogPost(req, res, next) {
  try {
    const { postMessage } = req.body;

    const post = await createPost({
      userId: req.user.userId,
      postMessage,
    });

    return res.status(201).json({
      post,
    });
  } catch (err) {
    next(err);
  }
}

async function editBlogPost(req, res, next) {
  try {
    const postId = req.params.postId;

    const { postMessage } = req.body;

    const post = await updatePost({
      postId,
      postMessage,
    });

    return res.status(200).json({
      post,
    });
  } catch (err) {
    next(err);
  }
}
async function deleteBlogPost(req, res, next) {
  try {
    const postId = req.params.postId;

    const post = await deletePost({
      postId,
    });

    return res.status(200).json({
      post,
    });
      } catch (err) {
    next(err);
  }
}


module.exports = {
  getBlogPosts,
  createNewBlogPost,
  editBlogPost,
  deleteBlogPost,
}