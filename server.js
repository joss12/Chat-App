const {ApolloServer} = require ('apollo-server');
const typeDefs = require('./typedefs');
const resolvers = require('./resolvers');
const jwt = require('jsonwebtoken');

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    //This context will behave like a middleware
    //You can also create it in a separate file and export it as a module,
    //middleware, if you have understanding of middleware
    context: ({req})=>{
       const {authorization} =  req.headers
       if(authorization){
          const {userId} = jwt.verify(authorization, process.env.JWT_SECRET);
          return {userId}
       }
    }
    
});

server.listen().then(({url})=>{
    console.log(`Server ready at ${url}`);
})