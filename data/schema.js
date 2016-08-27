/* eslint-disable no-use-before-define */
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

import {
  Post,
  User,
  getPost,
  getPosts,
  getUser,
  getViewer,
} from './database';

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Post') {
      return getPost(id);
    } else if (type === 'User') {
      return getUser(id);
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
  name: 'POST',
  nodeType: GraphQLPost,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    posts: {
      type: PostsConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, args) =>
        connectionFromArray(getPosts(), args),
    },
    postCount: {
      type: GraphQLInt,
      resolve: () => getPosts().length,
    },
  },
  interfaces: [nodeInterface],
});


const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
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
