// get comments // Don't need as they are attached to posts and handled in getAllPostsAndComments
// get comment // Don't need right now
// create comment ✅
// update comment ✅
// delete comment ✅

const prisma = require("../lib/prisma");

async function createComment({ userId, postId, commentMessage }) {
  return prisma.comment.create({
    data: {
      userId,
      postId,
      commentMessage,
    },
  });
}

async function updateComment(commentId, userId, commentMessage) {
  return prisma.comment.update({
    where: {
      id: commentId,
      userId,
    },
    data: {
      commentMessage,
    },
  });
}

async function deleteComment(commentId, userId) {
  return prisma.comment.delete({
    where: {
      id: commentId,
      userId,
    },
  });
}

async function getCommentUserId(commentId) {
  return prisma.comment.findFirst({
    where: {
      id: commentId,
    },
    select: {
      userId: true,
    }
  })
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentUserId,
};
