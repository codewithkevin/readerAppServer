import dotenv from 'dotenv';
import path from 'path';


const configResult = dotenv.config({
    path: path.resolve(__dirname, '..', '.env'),
});

if (configResult && configResult.error) {
    console.log('App .env config error');
    throw configResult.error;
}

import app from './app';
import { DatabaseClient } from './database/client';
import { runMigration } from './database/migrate';

(async () => {
    await DatabaseClient.connect();

    // run migrations
    await runMigration();
})();



const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});