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

async function updateComment({ userId, commentId, commentMessage }) {
  return prisma.comment.update({
    where: {
      userId,
      id: commentId,
    },
    data: {
      commentMessage,
    },
  });
}

async function deleteComment(userId, commentId) {
  return prisma.comment.delete({
    where: {
      userId,
      id: commentId,
    },
  });
}

async function getCommentUserId(commentId) {
  // return prisma.comment.findFirst({
  return prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      userId: true,
    },
  });
}

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  getCommentUserId,
};
