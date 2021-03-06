/* eslint-disable arrow-body-style, consistent-return */
import { Post, User, Comment } from '../models';

//
// Post methods
// -------------------------
export const getPosts = async() => {
  try {
    const posts = await Post.findAll();
    const postObjs = posts.map(post => post.get());

    return postObjs;
  } catch (e) {
    if (e) throw e;
  }
};

export const getPost = async(id) => {
  try {
    const post = await Post.findById(id);
    return post.get();
  } catch (e) {
    if (e) throw e;
  }
};

//
// Comment methods
// -------------------------
export const getComment = async(id) => {
  try {
    const comment = await Comment.findById(id);
    return comment.get();
  } catch (e) {
    if (e) throw e;
  }
};

export const getComments = async() => {
  try {
    const comments = await Comment.findAll();
    const commentObjs = comments.map(comment => comment.get());

    return commentObjs;
  } catch (e) {
    if (e) throw e;
  }
};

//
// User methods
// -------------------------
export const getUser = async(id) => {
  try {
    const user = await User.findById(id, {
      attributes: ['id', 'email', 'username', 'name'],
      include: [{
        model: Post,
        as: 'posts',
        attributes: ['id', 'text'],
      }],
    });
    return user.get();
  } catch (e) {
    if (e) throw e;
  }
};


// // import {
// //   // User,
// //   Post,
// // } from '../models';
//
// export class Post {}
// export class User {}
//
// // Mock authenticated ID
// const VIEWER_ID = 'me';
//
// // Mock user data
// const viewer = new User();
// viewer.id = VIEWER_ID;
// const usersById = {
//   [VIEWER_ID]: viewer,
// };
//
// //
// // export function getPost(id) {
// //   Post.findById(id)
// //     .then(post => {
// //       return post;
// //     }).catch(err => {
// //       if (err) throw err;
// //     });
// // }
// //
// // export function getPosts() {
// //   Post.findAll()
// //     .then(posts => {
// //       return posts;
// //     }).catch(err => {
// //       if (err) throw err;
// //     });
// // }
//
// // export function getUser(id) {
// //
// // }
// //
// // export function getViewer(id) {
// //
// // }
//
//
// // Mock Post data
// const postsById = {};
// const postIdsByUser = {
//   [VIEWER_ID]: [],
// };
// let nextPostId = 0;
// addPost('Taste JavaScript', true);
// addPost('Buy a unicorn', false);
//
// export function addPost(text, complete) {
//   const post = new Post();
//   post.complete = !!complete;
//   post.id = `${nextPostId++}`;
//   post.text = text;
//   postsById[post.id] = post;
//   postIdsByUser[VIEWER_ID].push(post.id);
//   return post.id;
// }
//
// export function changePostStatus(id, complete) {
//   const post = getPost(id);
//   post.complete = complete;
// }
//
// export function getPost(id) {
//   return postsById[id];
// }
//
// export function getPosts(status = 'any') {
//   const posts = postIdsByUser[VIEWER_ID].map(id => postsById[id]);
//   if (status === 'any') {
//     return posts;
//   }
//   return posts.filter(post => post.complete === (status === 'completed'));
// }
//
// export function getUser(id) {
//   return usersById[id];
// }
//
// export function getViewer() {
//   return getUser(VIEWER_ID);
// }
//
// export function markAllPosts(complete) {
//   const changedPosts = [];
//   getPosts().forEach(post => {
//     if (post.complete !== complete) {
//       post.complete = complete;
//       changedPosts.push(post);
//     }
//   });
//   return changedPosts.map(post => post.id);
// }
//
// export function removePost(id) {
//   const postIndex = postIdsByUser[VIEWER_ID].indexOf(id);
//   if (postIndex !== -1) {
//     postIdsByUser[VIEWER_ID].splice(postIndex, 1);
//   }
//   delete postsById[id];
// }
//
// export function removeCompletedPosts() {
//   const postsToRemove = getPosts().filter(post => post.complete);
//   postsToRemove.forEach(post => removePost(post.id));
//   return postsToRemove.map(post => post.id);
// }
//
// export function renamePost(id, text) {
//   const post = getPost(id);
//   post.text = text;
// }
