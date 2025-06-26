import { Request } from "express";

export class AuthRequest extends Request {
    user:{
        userId:number;
        email:string;
        name:string;
    }
}