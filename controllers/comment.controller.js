const {
  createComment,
  updateComment,
  deleteComment,
  getCommentUserId,
} = require("../services/comment.service.js");

async function createNewBlogComment(req, res, next) {
  try {
    const postId = req.params.postId;

    const { commentMessage } = req.body;

    const comment = await createComment({
      userId: req.user.userId,
      postId,
      commentMessage,
    })

    return res.status(201).json({
      comment,
    })

  } catch (err) {
    next(err);
  }
}

async function editBlogComment(req, res, next) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const commentUserId = await getCommentUserId(commentId);

    if (!commentUserId) {
      return res.sendStatus(404);
    }

    if (userId !== commentUserId.userId) {
      return res.sendStatus(403); // as in... "I know who you are, but you're not allowed to do this."
    }

    const { commentMessage }  = req.body;

    const comment = await updateComment(
      commentId,
      userId, // NOTE - this is an authenticated user ID checked by verifyUser
      commentMessage,
    );

    return res.status(200).json({
      comment,
    })

  } catch (err) {
    next(err);
  }
}

async function deleteBlogComment(req, res, next) {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;

    const commentUserId = await getCommentUserId(commentId);

    if (!commentUserId) {
      return res.sendStatus(404);
    }

    if (userId !== commentUserId.userId) {
      return res.sendStatus(403); // as in... "I know who you are, but you're not allowed to do this."
    }

    const comment = await deleteComment(
      commentId,
      userId, // NOTE - this is an authenticated user ID checked by verifyUser
    );

    return res.status(200).json({
      comment,
    })
    
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createNewBlogComment,
  editBlogComment,
  deleteBlogComment,
};
