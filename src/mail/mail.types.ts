export interface TransportOptions {
    service: string;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}