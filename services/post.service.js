// create post ✅
// get all posts ✅
// get one post // TODO - do I need this? Likely not...
// update post ✅
// delete post ✅

const prisma = require("../lib/prisma");

async function createPost({ userId, published, postTitle, postMessage }) {
  return prisma.post.create({
    data: {
      userId,
      published,
      postTitle,
      postMessage,
    },
  });
}

async function getAllPostsAndComments() {
  return prisma.post.findMany({
    select: {
      id: true,
      published: true,
      postTitle: true,
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

async function getPublishedPostsAndComments() {
  return prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      published: true,
      postTitle: true,
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
              // email: true,
              firstName: true,
              lastName: true,
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

async function updatePost(postId, published, postTitle, postMessage) {
  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      published,
      postTitle,
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
  getAllPostsAndComments,
  getPublishedPostsAndComments,
  updatePost,
  deletePost,
};
