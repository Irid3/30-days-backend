import express from 'express';
import dotenv from 'dotenv';
import Logging from './lib/Logging.js';
import mongoose from 'mongoose';
import serv from './config/config.js';
import routers from './routes/index.js';

const Logger = new Logging();
dotenv.config();
const app = express();
mongoose
    .connect(serv.mongo.url, { w: 'majority', retryWrites: true })
    .then(() => {
        Logger.info(`Connected to mongodb `);
        startApp();
    })
    .catch((err) => {
        Logger.error('failed to connect mongodb ');
        Logger.error('Reason : ', err.message, err.stack, err);
        console.log(err);
    });

const startApp = () => {
    app.use((req, res, next) => {
        Logger.info(` Incoming Request -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            Logger.info(
                ` Incoming Request Finish -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - StatusCode: [${req.statusCode}] - Status: [${req.statusMessage}]`
            );
        });
        next();
    });
    app.use(express.json());
    app.use('/catalog', routers);
    app.get('/catalog/', (req, res) => {
        res.status(200).json({ message: 'Home' });
    });
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Header', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
        if (res.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
            return res.status(200).json({});
        }
        next();
    });
    app.listen(serv.process.port, () => {
        Logger.info(`Server Running on port ${serv.process.port}`);
    });
};
