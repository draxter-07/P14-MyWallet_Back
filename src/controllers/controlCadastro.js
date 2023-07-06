import joi from "joi"

export function postCadastro(req, db){
    const body = req.body;
    const name = body.name;
    const email = body.email;
    const password = body.password;
    const [valueName, errorName] = joi.string().required();
    const [valueEmail, errorEmail] = joi.email().required();
    const [valuePassword, errorPassword] = joi.string().min(3).required();
    if (errorName == undefined && errorEmail == undefined && errorPassword == undefined){
        // Verifica se o nome já está na base
        db.collection("Users").find().toArray().then(users =>{
            for(let a = 0; a < users.length; a++){
                if (users[a].email == email){
                    return({status: 409, message: "O email preenchido já está cadastrado"});
                }
                else if(a == users.length - 1 && users[a].email == email){
                    // Salva na database
                    db.collection("Users").insertOne({name: name, email: email, password: password});
                    return({status: 201, message: ""});
                }
            }
        })
    }
    else if (errorName != undefined && errorEmail == undefined && errorPassword == undefined){
        return({status: 422, message: "O campo Nome não foi preenchido corretamente"});
    }
    else if (errorName == undefined && errorEmail != undefined && errorPassword == undefined){
        return({status: 422, message: "O campo Email não foi preenchido corretamente"});
    }
    else if (errorName == undefined && errorEmail == undefined && errorPassword != undefined){
        return({status: 422, message: "O campo Senha não foi preenchido corretamente"});
    }
    else if (errorName != undefined && errorEmail != undefined && errorPassword == undefined){
        return({status: 422, message: "O campo Nome e Email não foram preenchido corretamente"});
    }
    else if (errorName != undefined && errorEmail == undefined && errorPassword != undefined){
        return({status: 422, message: "O campo Nome e Senha não foram preenchido corretamente"});
    }
    else if (errorName == undefined && errorEmail != undefined && errorPassword != undefined){
        return({status: 422, message: "O campo Email e Senha não foram preenchido corretamente"});
    }
    else if (errorName != undefined && errorEmail != undefined && errorPassword != undefined){
        return({status: 422, message: "Os campos não foram preenchido corretamente"});
    }
}