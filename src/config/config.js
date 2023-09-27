import dotenv from 'dotenv';
dotenv.config();

let MONGO_URL = `mongodb+srv://${process.env.USERNAME_MONGO}:${process.env.PASSWORDS}@train.cqspyb4.mongodb.net/?retryWrites=true&w=majority`;

let SERVER_PORT = process.env.PORT ? process.env.PORT : 8080;
let serv;
export default serv = {
    mongo: {
        url: MONGO_URL
    },
    process: {
        port: SERVER_PORT
    }
};
