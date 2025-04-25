import { Joi } from "celebrate";
import { AuthMethod } from "./types";
import { RoleEnums } from "../constants";



export const emailPasswordSignupValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    method: Joi.string().valid(AuthMethod.EmailPassword).required(),
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    role: Joi.string().valid(...Object.values(RoleEnums)).required()
});

export const usernamePasswordLoginValidator = Joi.object({
    method: Joi.string().valid(AuthMethod.UsernamePassword).required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
});