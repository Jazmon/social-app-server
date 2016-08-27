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

// const { nodeInterface, nodeField } = nodeDefinitions(
//   (globalId) => {
//     const { type, id } = fromGlobalId(globalId);
//     if (type === 'POST') {
//
//     }
//   }
// );

const Root = new GraphQLObjectType({
  name: 'Root',
  fields: {
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
  },
});

export const schema = new GraphQLSchema({
  query: Root,
  mutation: Mutation,
});

export default schema;
