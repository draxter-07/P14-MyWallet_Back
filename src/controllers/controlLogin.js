import joi from "joi"

export function postCadastro(req, db){
    const body = req.body;
    const email = body.email;
    const password = body.password;
    const [valueEmail, errorEmail] = joi.email().required();
    const [valuePassword, errorPassword] = joi.string().required();
    if (errorEmail == undefined && errorPassword == undefined){
        // Verifica se os dados batem
        db.collection("Users").find().toArray().then(users =>{
            for(let a = 0; a < users.length; a++){
                if (users[a].email == email){
                    if (users[a].password == password){
                        return({status: 200, message: "token"});
                    }
                    else{
                        return({status: 401, message: "A senha está incorreta"});
                    }
                }
                else if (a == users.length - 1 && users[a].email != email){
                    return({status: 404, message: "O email não está cadastrado"});
                }
            }
        })
    }
    else if (errorEmail != undefined && errorPassword == undefined){
        return({status: 422, message: "O campo Email não foi preenchido corretamente"});
    }
    else if (errorEmail == undefined && errorPassword != undefined){
        return({status: 422, message: "O campo Senha não foi preenchido corretamente"});
    }
    else if (errorEmail != undefined && errorPassword != undefined){
        return({status: 422, message: "Os campos não foram preenchidos corretamente"});
    }
}