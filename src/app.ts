import express from 'express';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import { Settings } from 'luxon';
import cors from 'cors';
import defaultRoutesHandler from './middlewares/defaultRoute.middleware';
import { errorMiddleware } from './error-handling/middleware/error.middleware';
import routes from './routes';

Settings.defaultZone = 'utc';


const app = express();

const originsWhitelistMap: { [key: string]: string[] } = {
    local: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    development: [],
    production: [],
};

app.use(cors({
    origin: function (origin, callback) {
        const APP_ENV = process.env.APP_ENV as string;
        const whitelists = originsWhitelistMap[APP_ENV as string];

        if (!origin || whitelists.includes(origin))
            return callback(null, true);

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('', routes);

app.all('*', defaultRoutesHandler);


app.use(errors());
app.use(errorMiddleware);

export default app;