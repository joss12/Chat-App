#This is a Backend Chat App built with nodejs-graphQl-mysql-prisma orm

# NPM install for install all the dependencies
Create a database in mysql and give it a name of your choice and connect it in the path set in the .env.

Next in prisma orm schema, create the fileds. examples:


// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User{
  id Int @id @default(autoincrement())
  firstName String
  lastName String
  email String @unique
  password String
  createdAt DateTime @default(now())
  receiver Message[] @relation(name:"reciever")
  sender Message[] @relation(name: "sender")
}


model Message{
  id Int @id @default(autoincrement())
  text String
  receiverId Int
  receiver User @relation(name:"reciever", fields: [receiverId], references: [id])
  senderId Int
  sender User @relation(name:"sender", fields: [senderId], references: [id])
  createdAt DateTime @default(now())
}

#npm start to Start the project

#To lunch Prisma studio
npx prisma studio. This will view your database
