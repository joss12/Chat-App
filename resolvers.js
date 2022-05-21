const pc = require('@prisma/client');
const {AuthenticationError, ForbiddenError} = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')



const prisma = new pc.PrismaClient();

const resolvers = {
    Query:{
    users: async(_,args,{userId})=>{
        console.log(userId);
        if(!userId) throw new ForbiddenError("You must be logged In");
        const users = await prisma.user.findMany({
            orderBy:{createdAt:"desc"},
            where:{
                id:{
                    not:userId
                }
            }
        })
        return users 
    }  ,
    messageByUser:async(_, {receiverId}, {userId})=>{
        if(!userId) throw new ForbiddenError("You need to be logged In");
       const message = await prisma.message.findMany({
            where:{
                OR:[
                    {senderId:userId, receiverId:receiverId},
                    {senderId:receiverId, receiverId:userId}
                ]
            },
            orderBy:{
                createdAt: "asc"
            }
        });
        return message
    }
},

    //Create a new user
    Mutation:{

        
        signupUser: async(_,{userNew})=>{
           const user =  await prisma.user.findUnique({where:{email:userNew.email}});
           if(user) throw new AuthenticationError(
               "User alread exists with that email"
               )

            //   bcrypt.hash(userNew.password, 12) 
            const hashedPassword = await bcrypt.hash(userNew.password, 10)
            const newUser = await prisma.user.create({
                data:{
                    ...userNew,
                    password: hashedPassword
                }
            })
            return newUser;
        },
        signinUser: async (_,{userSignin})=>{
            const user =  await prisma.user.findUnique({where:{email:userSignin.email}});
            if(!user) throw new AuthenticationError("User dosen't exist with that email");
            const passwordMatch = await bcrypt.compare(userSignin.password, user.password);
            if(!passwordMatch) throw new AuthenticationError("Email or Password is not valid");

            // const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);
            const payload = {userId: user.id};
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn: "7d"
            })
            return {token}
        },

        createMessage:async (_,{receiverId, text},{userId})=>{
            if(!userId) throw new AuthenticationError("You need to be logged In");

            const message = await prisma.message.create({
                data:{
                    text:text,
                    receiverId,
                    senderId:userId
                }
            })
            return message
        }
    }
}

module.exports = resolvers;
