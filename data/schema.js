/* eslint-disable no-use-before-define, no-param-reassign, consistent-return, arrow-body-style */
import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import { resolver } from 'graphql-sequelize';
// import {
  // Post,
  // User,
  // getPost,
  // getPosts,
  // getUser,
  // getViewer,
// } from './database';
import { Post, User } from '../models';

const getPosts = async() => {
  try {
    const posts = await Post.findAll();
    const postObjs = posts.map(post => post.get());

    return postObjs;
  } catch (e) {
    if (e) throw e;
  }
};

const getPost = async(id) => {
  try {
    const post = await Post.findById(id);
    return post.get();
  } catch (e) {
    if (e) throw e;
  }
};

const getUser = async(id) => {
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

// function getPosts() {
//   Post.findAll()
//     .then(posts => { // eslint-disable-line arrow-body-style
//       const postObjs = posts.map(post => post.get());
//       console.log('postObjs', postObjs);
//       return postObjs;
//     })
//     .catch(err => {
//       throw err;
//     });
// }

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Post') {
      return resolver(Post, {
        before: (options, args) => {
          options.where = options.where || {};
          options.where.id = { $in: args.ids };
          return options;
        },
      });
      // return getPost(id);
    } else if (type === 'User') {
      console.log('user resolver');
      return resolver(User, {
        before: (options, args) => {
          console.log('user resolver before');
          options.where = options.where || {};
          options.where.id = { $in: args.ids };
          return options;
        },
      });
      // return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Post) {
      return GraphQLPost;
    } else if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLPost = new GraphQLObjectType({
  name: 'Post',
  description: 'A post a user has posted to be visible on other users walls',
  fields: {
    id: globalIdField('Post'),
    text: {
      type: GraphQLString,
      description: 'the content of the post',
      resolve: (obj) => console.log('obj', obj) || obj.text,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: PostConnection,
  edgeType: PostEdge,
} = connectionDefinitions({
  name: 'Post',
  nodeType: GraphQLPost,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    email: {
      type: GraphQLString,
      description: 'the email of the user',
      resolve: (user) => user.email,
    },
    posts: {
      type: PostConnection,
      args: connectionArgs,
      resolve: async(user, args) => {
        let posts = await user.getPosts();
        posts = posts.map(post => post.get());
        console.log('posts', posts);
        return connectionFromArray(posts, args);
      }
    },
    // posts: {
    //   type: new GraphQLList(GraphQLPost),
    //   args: {},
    //   resolve: async(root, args) => {
    //     return await getPosts();
    //   }
    // },
    postCount: {
      type: GraphQLInt,
      resolve: async(user, args) => {
        const posts = await user.getPosts();
        console.log('posts', posts);
        return posts.length;
      },
    },
  },
  interfaces: [nodeInterface],
});


const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: resolver(User, {
        include: true,
      }),
    },
  },
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//   },
// });

export const schema = new GraphQLSchema({
  query: Root,
  // mutation: Mutation,
});

export default schema;
