# workhome-api
A work log for everyone.

## Stack
- Nodejs
- Express
- Mongodb


# Getting Started
To get the Node server running locally:
### Installation
Make sure you have  [Node.js](https://nodejs.org/) and yarn installed. 
Also as we use mongodb for database which can be installed to your computer and serve easily or use mongodb atlas for the database.

Here Nodejs version v10.15.3 is used. You can use NVM to install the exact version. Also yarn v1.21.1 as package dependeny manager

Clone this repo:

 ` git clone https://github.com/yathomasi/workhome-api.git `
 

Install the dependencies and devDependencies.

```sh
cd workhome-api
yarn install
```
### Manage Environment File

You can create a new `.env` file in root directory and copy`.env.default`content.

OR
Copy the file `.env.default` to `.env` and replace the value in key=value format environment file

Replace the MONGO_URL with your database url.

### Running the server

Now let's run the server

`yarn start ` for simple nodejs run

`yarn start:dev` run using nodemon

`yarn start:debug` debug mode with nodemon


