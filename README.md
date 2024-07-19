## Nobel Laureates Backend

Backend for the Nobel Laureates Project. This is built with Express, MongoDB, TypeScript. The ORM used is Mongoose. Handles authentication as well as serving content from the MongoDB database. Authentication makes use of JWT with Access tokens and refresh tokens.
The frontend for the project is at [Nobel Laureates Frontend](https://github.com/Sadeeptha-B/nobel-laureates-frontend)

## Running locally

Clone this github repository with

```
git clone https://github.com/Sadeeptha-B/nobel-laureates-backend.git
```

It is recommended to run this app with Node.js v20.15.1 (currently LTS). Install the dependencies for the project with `npm install` at the root directory of the project

The app requires a .env file to store secrets. Create .env file at the root directory with the following

```
PORT=
CLIENT_URL=
MONGO_URI=
TOKEN_SECRET=
```

The port denotes the port in which the server is to be run. Client URL is for the frontend project URL when running locally. Mongo URI is the connection string to a MongoDB Atlas Database. Token secret is the secret used to sign the JWT key.

After setting up the .env file, run the project with

```
npm start
```
