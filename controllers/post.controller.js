const {
  createPost,
  getAllPostsAndComments,
  getPublishedPostsAndComments,
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

async function getPublishedBlogPosts(req, res, next) {
  try {
    const posts = await getPublishedPostsAndComments();

    return res.status(200).json({
      posts,
    });
  } catch (err) {
    next(err);
  }
}

async function createNewBlogPost(req, res, next) {
  try {
    const { published, postTitle, postMessage } = req.body;

    const post = await createPost({
      userId: req.user.userId,
      published,
      postTitle,
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

    const { published, postTitle, postMessage } = req.body;

    const post = await updatePost(
      postId,
      published,
      postTitle,
      postMessage,
    );

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

    const post = await deletePost(
      postId,
    );

    return res.status(200).json({
      post,
    });
      } catch (err) {
    next(err);
  }
}


module.exports = {
  getBlogPosts,
  getPublishedBlogPosts,
  createNewBlogPost,
  editBlogPost,
  deleteBlogPost,
}