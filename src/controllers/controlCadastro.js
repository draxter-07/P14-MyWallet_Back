import joi from "joi"
import { MongoClient } from 'mongodb'
import dotenv from "dotenv"

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
var db;
mongoClient.connect().then(db = mongoClient.db());


export function postCadastro(req, res){
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const joiName = joi.string().required();
    const joiEmail = joi.string().email().required();
    const joiPassword = joi.string().min(3).required();
    const joiObject = joi.object({name: joiName, email: joiEmail, password:  joiPassword}).required();
    const { value, error } = joiObject.validate(body);
    if (error == undefined){
        // Verifica se o nome já está na base
        function right(){
            db.collection("Users").insertOne({id: body, transactions: {}});
            res.status(201).send("token").end();
        }
        db.collection("Users").find().toArray().then(users =>{
            if (users.length == 0){
                right();
            }
            else{
                for(let a = 0; a < users.length; a++){
                    if (users[a].id.email == email){
                        res.status(409).send("O email já está cadastrado").end();
                    }
                    else if(a == users.length - 1 && users[a].id.email != email){
                        // Salva na database
                        right();
                    }
                }
            }
        })
    }
    else{
        res.status(422).send("Os campos não foram preenchidos corretamente").end();
    }
}