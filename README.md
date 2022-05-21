const {ApolloServer, gql} = require ('apollo-server');
const crypto = require('crypto');



const users = [
    {
        id:"grfgkkfsdg",
        firstName:"Eddy",
        lastName: "Mouity",
        email: "eddy@email.com",
        password: '123456'
    },
    {
        id: "dgsgsgvwarg",
        firstName:"Joss",
        lastName: "Mouity",
        email: "joss@email.com",
        password: '123456789'
    }
]

const Todos = [
    {
        title: "Buy a book",
        by:"grfgkkfsdg"
    },

    {
        title: "druck coffe",
        by: "dgsgsgvwarg"
    },
    {
        title:"eat a bread",
        by: "dgsgsgvwarg"
    }
]

const typeDefs = gql `
    type Query{
        users:[User]
        user(id:ID!):User
    },

    input UserInput{
            firstName:String!
            lastName:String!
            email:String!
            password:String!
    },

    type Mutation{
        createUser(userNew:UserInput!):User
    },

    type User{
        id:ID!
        firstName: String
        lastName: String
        email: String,
        todos:[Todo]
    },
     type Todo{
         title: String!
         by: ID!
     }
`

const resolvers = {
    Query:{
        users:()=>users,
        user:(_, {id}, {userLoggedIn})=>{
            if(!userLoggedIn) throw new Error('You are not loggedIn')
            return users.find(item=>item.id == id)
        }
    },
    User:{
        todos:(parent)=>{
            return Todos.filter(todo=>todo.by == parent.id)
        }
    },

    Mutation:{
        createUser:(_, {userNew})=>{
            const newUser = {
                id:crypto.randomUUID(),
                ...userNew
            }
            users.push(newUser);
            return newUser
        }
    }
}




const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    context:{
        userLoggedIn: true
    }
});

server.listen().then(({url})=>{
    console.log(`Server ready at ${url}`);
});


`````````````````
ON graphQl playground
###getAllUsers
query getAllUsers{
  users{
    id
    firstName
    lastName
    email
  }
};
``````````````````
###getUserById
fragment userFields on User{
  id
  firstName
  lastName
  email
}
query getUserById($uId1: ID!, $uId2: ID!) {
  u1:user(id: $uId1){
    ...userFields
  }
  u2:user(id: $uId2){
    ...userFields
  }
}
-------------------------------
Variables
{
  "uId1":"grfgkkfsdg",
  "uId2":"dgsgsgvwarg"
  
}

`````````````````````
###CreateUser
mutation CreateUser($userNew: UserInput!) {
  user:createUser(userNew: $userNew) {
    id
    firstName
    lastName
    email
  }
}
---------------------------------
Variables
{
  "userNew":{
    "firstName": "Joss",
    "lastName": "Mouity",
    "email": "axel@email.com",
    "password": "123456"
  }
}




