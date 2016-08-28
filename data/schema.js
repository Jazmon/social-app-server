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
import { Post, User, Comment } from '../models';


import {
  getPosts,
  getPost,
  getUser,
  getComment,
  getComments,
} from './database';

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
      return resolver(User, {
        before: (options, args) => {
          options.where = options.where || {};
          options.where.id = { $in: args.ids };
          return options;
        },
      });
      // return getUser(id);
    } else if (type === 'Comment') {
      return resolver(Comment, {
        before: (options, args) => {
          options.where = options.where || {};
          options.where.id = { $in: args.ids };
          return options;
        },
      });
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Post) {
      return GraphQLPost;
    } else if (obj instanceof User) {
      return GraphQLUser;
    } else if (obj instanceof Comment) {
      return GraphQLComment;
    }
    return null;
  }
);


const GraphQLComment = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment on a post',
  fields: {
    id: globalIdField('Comment'),
    text: {
      type: GraphQLString,
      description: 'the content of the comment',
      resolve: (comment) => comment.text,
    },
    // commenter: {
    //   type: GraphQLUser,
    //   resolve: async(comment) => {
    //     const user = await comment.getCommenter();
    //     return user.get();
    //   },
    // },
  },
});


const {
  connectionType: CommentConnection,
  edgeType: CommentEdge,
} = connectionDefinitions({
  name: 'Comment',
  nodeType: GraphQLComment,
});

const GraphQLPost = new GraphQLObjectType({
  name: 'Post',
  description: 'A post a user has posted to be visible on other users walls',
  fields: {
    id: globalIdField('Post'),
    text: {
      type: GraphQLString,
      description: 'the content of the post',
      resolve: (post) => post.text,
    },
    comments: {
      type: CommentConnection,
      args: connectionArgs,
      resolve: async(p, args) => {
        console.log('p', p);
        const post = await Post.findById(p.id);
        let comments = await post.getComments();
        comments = comments.map(c => c.get());
        return connectionFromArray(comments, args);
      },
    },
    commentCount: {
      type: GraphQLInt,
      resolve: async(p) => {
        const post = await Post.findById(p.id);
        const comments = await post.getComments();
        return comments.length;
      },
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
        // console.log('posts', posts);
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
        // console.log('posts', posts);
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
