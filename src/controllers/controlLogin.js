import joi from "joi"
import { MongoClient } from 'mongodb'
import dotenv from "dotenv"

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
var db;
mongoClient.connect().then(db = mongoClient.db());

export function postLogin(req, res){
    const body = req.body;
    const email = body.email;
    const password = body.password;
    const joiEmail = joi.string().email().required();
    const joiPassword = joi.string().required();
    const joiObject = joi.object({email: joiEmail, password: joiPassword}).required();
    const { value, error } = joiObject.validate(body);
    if (error == undefined){
        // Verifica se os dados batem
        db.collection("Users").find().toArray()
            .then(users =>{
                if (users.length > 0){
                    for(let a = 0; a < users.length; a++){
                        if (users[a].id.email == email){
                            if (users[a].id.password == password){
                                res.status(201).send("token").end();
                            }
                            else{
                                res.status(401).send("A senha está incorreta").end();
                            }
                        }
                        else if (a == users.length - 1 && users[a].id.email != email){
                            res.status(404).send("O email não está cadastrado").end();
                        }
                    }
                }
                else{
                    res.status(404).send("O email não está cadastrado").end();
                }
            })
            .catch(err => console.log(err.message));
    }
    else{
        res.status(422).send("Os campos não foram preenchidos corretamente").end();
    }
}