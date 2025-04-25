import { Umzug, MongoDBStorage } from 'umzug';
import path from 'path';
import { DatabaseClient } from './client.js';

const initializeMigration = async () => {
    const mongooseConnection = await DatabaseClient.getDatabaseConnection();
    return new Umzug({
        migrations: {
            glob: path.join(__dirname, 'migrations/*.{js,ts}'),
        },
        context: mongooseConnection,
        storage: new MongoDBStorage({
            connection: mongooseConnection,
        }),
        logger: console,
    });
};

export const runMigration = async () => {
    const umzug = await initializeMigration();

    const pendingMigrations = await umzug.pending();
    console.log('Pending migrations:', pendingMigrations);

    try {
        await umzug.up();
    } catch (e) {
        console.log(e);
        throw e;
    }
};
