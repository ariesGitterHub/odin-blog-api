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

// NOTE - because this has been a source of confusion... 
// In the function below the { } in the function parameters tells JavaScript to expect one object and extract the specified properties from it.
async function updatePost({ userId, postId, postTitle, postMessage }) {
// So for above, JavaScript receives one object and extracts its four properties into local variables, e.g.,
// - userId gets 1.
// - postId gets 42.
// - postTitle gets "My Updated Title".
// - postMessage gets "My updated message.".
// Inside the function, you can use those variables directly without repeatedly writing object.userId, object.postId, and so on.
// Notice that the curly braces in the function parameters are not the same as the braces in the Prisma query. The first set performs destructuring; the others define objects.
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

// Below, this function accepts three separate arguments, in a specific order.
async function updatePublishedPost( userId, postId, published ) {
  // Above, JavaScript assigns the arguments by position:
  // Argument	    Parameter
  // 1	          userId
  // 42	          postId
  // true	        published
  // ... There is no object to destructure, so you don't need { } around the parameters.
  return prisma.post.update({
    where: {
      userId,
      id: postId,
    },
    data: {
      published,
    },
  });
}

// NOTE - Both approaches above work. The main difference is how you pass arguments to the function.
//*** Which approach should you use in the blog API?
// For your service layer, lean toward object destructuring when a function accepts several related values, as updatePost does.

// It also gives you flexibility if you later add another field, such as published, to that function. You can add a property without having to remember the position of every argument at every call site.

// The second function has only three parameters, so individual arguments are perfectly reasonable. However, consistency across related service functions can also be valuable.

// REMINDER - using { } in the function parameters does not change how Prisma updates the database. It only changes how JavaScript receives and extracts the arguments before executing the Prisma query.

async function deletePost(userId, postId) {
  return prisma.post.delete({
    where: {
      userId,
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
  updatePublishedPost,
  deletePost,
  getPostUserId,
};
