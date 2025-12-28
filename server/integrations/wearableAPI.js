const axios = require('axios');
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');

const WearableDataType = new GraphQLObjectType({
    name: 'WearableData',
    fields: () => ({
        device: { type: GraphQLString },
        heartRate: { type: GraphQLString },
        steps: { type: GraphQLString },
        sleep: { type: GraphQLString },
    }),
});

const fetchWearableData = async (deviceId) => {
    try {
        const response = await axios.get(`https://api.wearabledevice.com/data/${deviceId}`, {
            headers: {
                'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching wearable data:', error);
        throw new Error('Failed to fetch wearable data');
    }
};

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        wearableData: {
            type: WearableDataType,
            args: { deviceId: { type: GraphQLString } },
            resolve(parent, args) {
                return fetchWearableData(args.deviceId);
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Add mutations if needed
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});