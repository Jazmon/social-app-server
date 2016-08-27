/* eslint-disable no-use-before-define, no-param-reassign */
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

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Post') {
      resolver(Post, {
        before: (options, args) => {
          options.where = options.where || {};
          options.where.id = { $in: args.ids };
          return options;
        },
      });
      // return getPost(id);
    } else if (type === 'User') {
      console.log('user resolver');
      resolver(User, {
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
      resolve: (obj) => obj.text,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: PostsConnection,
  edgeType: GraphQLPostEdge,
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
      resolve: (obj) => console.log(obj) || obj.email,
    },
    posts: {
      type: PostsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, args) =>
        connectionFromArray(resolver(Post, {
          before: (options, args2) => {
            if (args2.first) {
              options.order = options.order || [];
              options.order.push(['created_at', 'ASC']);

              if (args2.first !== 0) {
                options.limit = args2.first;
              }
            }
            return options;
          }
        }), args),
    },
    postCount: {
      type: GraphQLInt,
      resolve: resolver(Post).length,
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
