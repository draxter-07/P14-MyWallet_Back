import { MongoClient, ObjectId } from 'mongodb'
import dotenv from "dotenv"
import joi from "joi"

export function postTrans(){
    const auth = req.headers.authorization;
    const joiAuth = joi.string().required();
    const { error, value } = joiAuth.validate(auth);
    if (error == undefined){
      
    }
    else{
      res.status(401).end();
    }
}