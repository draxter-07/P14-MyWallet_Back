import express from 'express'
import cors from 'cors'
import { postCadastro } from "./controllers/controlCadastro.js"
import { postLogin } from "./controllers/controlLogin.js"

const app = express();
app.use(express.json());
app.use(cors());

app.post("/cadastro", postCadastro);

app.post("/login", postLogin);

app.listen(5000, () => console.log("Running on port 5000"));