// get comments // Don't need as they are attached to posts and handled in getAllPosts
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

async function updateComment(commentId, commentMessage) {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      commentMessage,
    },
  });
}

async function deleteComment(commentId) {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
};
