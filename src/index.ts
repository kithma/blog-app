import { ApolloServer } from "apollo-server";
import { Query } from "./resolvers/index";
import { typeDefs } from "./Schema";

const server = new ApolloServer({
	typeDefs,
	resolvers: {
		...Query
	}
});

server.listen().then(({ url }) => {
	console.log(`Server ready on ${url}`)
})