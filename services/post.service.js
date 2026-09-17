// create post ✅
// get all posts ✅
// get one post // do I need this? Likely not...
// update post ✅
// delete post ✅

const prisma = require("../lib/prisma");

async function createPost({ userId, postMessage }) {
  return prisma.post.create({
    data: {
      userId,
      postMessage,
    },
  });
}

async function getAllPosts() {
  return prisma.post.findMany({
    select: {
      id: true,
      postMessage: true,
      createdAt: true,
      updatedAt: true,

      comments: {
        select: {
          id: true,
          commentMessage: true,
          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function updatePost(postId, postMessage) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      postMessage,
    },
  });
}

async function deletePost(postId) {
  return prisma.post.delete({
    where: {
      id: postId,
    }
  })
}

module.exports = {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
};
