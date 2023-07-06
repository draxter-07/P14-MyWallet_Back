import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb'
import dotenv from "dotenv"
import { postCadastro } from "./controllers/controlCadastro.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
var db;

mongoClient.connect().then(db = mongoClient.db());

app.post("/cadastro", (req, res) => {
    r = postCadastro(req, db);
    res.status(r.status);
    res.send(r.message);
});

app.post("/login", (req, res) => {
    r = postLogin(req, db);
    res.status(r.status);
    res.send(r.message);
})

app.listen(5000, () => console.log("Running on port 5000"));