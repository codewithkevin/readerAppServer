import dotenv from "dotenv";
import { TransportOptions } from "./mail.types";

dotenv.config();

const mailConfig: TransportOptions = {
    service: "gmail",
    secure: true,
    auth: {
        user: "readerapp2018@gmail.com" as string,
        pass: "zgvdvmqxptejkxbc" as string,
    },
};

export default mailConfig;
