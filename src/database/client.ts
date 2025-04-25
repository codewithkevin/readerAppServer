import { isDevelopmentEnvironment, isProductionEnvironment } from '../helpers/utils.helper.js';
import mongoose from 'mongoose';

export class DatabaseClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static connection: any;

    public static async connect(): Promise<mongoose.Connection> {
        if (DatabaseClient.connection) {
            return DatabaseClient.connection;
        }

        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            connectTimeoutMS: 30000,
        };

        const {
            MONGO_DB_USER: user,
            MONGO_DB_HOST: host,
            MONGO_DB_DATABASE: database,
            MONGO_DB_PASSWORD: password,
            MONGO_DB_PORT: port,
            MONGODB_CLUSTER: cluster,
            APP_ENV,
        } = process.env;


        if (!user || !password || !host || !database || !port)
            throw new Error('Missing required environment variables for database connection');

        let connectionURI = `mongodb://${user}:${password}@${host}:${port}/${database}`;
        if (isDevelopmentEnvironment(APP_ENV as string) || isProductionEnvironment(APP_ENV as string)) {
            connectionURI = `mongodb+srv://${user}:${password}@${cluster}/${database}?retryWrites=true&w=majority`;
        }

        DatabaseClient.connection = await mongoose.connect(connectionURI, options);
        return DatabaseClient.connection;
    }

    public static async getDatabaseConnection(): Promise<mongoose.Connection> {
        if (!DatabaseClient.connection) {
            await DatabaseClient.connect();
        }
        return mongoose.connection;
    }
}
