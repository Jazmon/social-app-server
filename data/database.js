/* eslint-disable arrow-body-style */
import {
  // User,
  Post,
} from '../models';

export class User {}

// Mock authenticated ID
const VIEWER_ID = 'me';

// Mock user data
const viewer = new User();
viewer.id = VIEWER_ID;
const usersById = {
  [VIEWER_ID]: viewer,
};

export function getPost(id) {
  Post.findById(id)
    .then(post => {
      return post;
    }).catch(err => {
      if (err) throw err;
    });
}

export function getPosts() {
  Post.findAll()
    .then(posts => {
      return posts;
    }).catch(err => {
      if (err) throw err;
    });
}

// export function getUser(id) {
//
// }
//
// export function getViewer(id) {
//
// }


export function getUser(id) {
  return usersById[id];
}

export function getViewer() {
  return getUser(VIEWER_ID);
}
