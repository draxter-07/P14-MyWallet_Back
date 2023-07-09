import { MongoClient, ObjectId } from 'mongodb'
import dotenv from "dotenv"
import joi from "joi"

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
var db;
mongoClient.connect().then(db = mongoClient.db());

export function postTrans(req, res){
    const auth = req.headers.authorization;
    const joiAuth = joi.string().required();
    const { error, value } = joiAuth.validate(auth);
    if (error == undefined){
        const body = req.body;
        const name = body.name;
        const date = body.date;
        const type = body.type;
        const valor = body.value;
        const joiName = joi.string().required();
        const joiDate = joi.date().required();
        const joiType = joi.string().valid("negativo", "positivo").required();
        const joiValue = joi.number().positive().required();
        const joiObject = joi.object({name: joiName, date: joiDate, type: joiType, value: joiValue}).required();
        const { error, value } = joiObject.validate(body);
        if (error == undefined){
            db.collection("Sessions").findOne({ token: auth })
                .then(obj => {db.collection("Users").findOne({ _id: new ObjectId(obj.userId) })
                    .then(userObject => {
                        const newObject = {_id: new ObjectId(obj.userId), id: userObject.id, transactions: [...userObject.transactions, body]}
                        db.collection("Users").findOneAndReplace({ _id: new ObjectId(obj.userId) }, newObject)
                            .then(resposta => res.status(200).end())
                            .catch(err => err.message)
                    })
                    .catch(err => err.message)
                })
                .catch(err => err.message)
        }
        else{
            res.status(422).send("Os campos não foram preenchidos corretamente").end();
        }
    }
    else{
      res.status(401).end();
    }
}