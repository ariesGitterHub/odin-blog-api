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
      user: { // New
        select: {
          id: true, //New
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      comments: {
        select: {
          id: true,
          commentMessage: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true, //New
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          // createdAt: "desc",
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
      // createdAt: "asc",
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
      user: { // New
        select: {
          id: true, //New
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      comments: {
        select: {
          id: true,
          commentMessage: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true, // New, need for edit button
              email: true, // TODO - Use this?? Likely not
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          // createdAt: "desc",
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
      // createdAt: "asc",
    },
  });
}

// async function updatePost(postId, published, postTitle, postMessage) {
async function updatePost({userId, postId, postTitle, postMessage}) {
  return prisma.post.update({
    where: {
      userId,
      // user_id: userId,
      id: postId,
    },
    data: {
      // published,
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

async function getPostUserId(postId) {
  return prisma.post.findFirst({
    where: {
      id: postId,
    },
    select: {
      userId: true,
    },
  });
}

module.exports = {
  createPost,
  getAllPostsAndComments,
  getPublishedPostsAndComments,
  updatePost,
  deletePost,
  getPostUserId,
};
