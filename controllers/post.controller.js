const {
  createPost,
  getAllPostsAndComments,
  getPublishedPostsAndComments,
  updatePost,
  updatePublishedPost,
  deletePost,
  getPostUserId,
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
    const { published, post_title, post_message } = req.body;

    const post = await createPost({
      userId: req.user.userId,
      published, // Should default to false
      postTitle: post_title.trim(),
      postMessage:  post_message.trim(),
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
    const userId = req.user.userId;   
    const postId = req.params.postId;

    const postUserId = await getPostUserId(postId);

    if (!postUserId) {
      return res.sendStatus(404);
    }

    if (userId !== postUserId.userId) {
      return res.sendStatus(403); // as in... "I know who you are, but you're not allowed to do this."
    }

    // const { published, postTitle, postMessage } = req.body;
    const { post_title, post_message } = req.body;

    const post = await updatePost({
      userId, // NOTE - this is an authenticated user ID checked by verifyUser
      postId,
      // published,
      postTitle: post_title.trim(),
      postMessage: post_message.trim(),
    });

    return res.status(200).json({
      post,
    });
  } catch (err) {
    next(err);
  }
}

async function togglePublished(req, res, next) {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const postUserId = await getPostUserId(postId);

    if (!postUserId) {
      return res.sendStatus(404);
    }

    if (userId !== postUserId.userId) {
      return res.sendStatus(403); // as in... "I know who you are, but you're not allowed to do this."
    }

    const { published } = req.body;

    const post = await updatePublishedPost(userId, postId, published);

    return res.status(200).json({
      post,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteBlogPost(req, res, next) {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const postUserId = await getPostUserId(postId);

    if (!postUserId) {
      return res.sendStatus(404);
    }

    if (userId !== postUserId.userId) {
      return res.sendStatus(403); // as in... "I know who you are, but you're not allowed to do this."
    }

    const post = await deletePost(
      userId,
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
  togglePublished,
  deleteBlogPost,
}