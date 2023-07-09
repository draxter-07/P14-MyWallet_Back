import { MongoClient, ObjectId } from 'mongodb'
import dotenv from "dotenv"
import joi from "joi"

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
var db;
mongoClient.connect().then(db = mongoClient.db());

export function getHome(req, res){
  const auth = req.headers.authorization;
  const joiAuth = joi.string().required();
  const { error, value } = joiAuth.validate(auth);
  if (error == undefined){
    db.collection("Sessions").findOne({ token: auth })
      .then(obj => {db.collection("Users").findOne({ _id: new ObjectId(obj.userId) })
        .then(userObject => res.send({name: userObject.id.name, transactions: userObject.transactions}).end())
        .catch(err => err.message)}
      )
      .catch(err => err.message)
  }
  else{
    res.status(401).end();
  }
}