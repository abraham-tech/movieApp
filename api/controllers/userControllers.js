const User = require("../data/schemas/usersModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = (req, res) => {

    if (req.body.username && req.body.password) {
        let username = req.body.username;
        let name = req.body.name;
        let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        const response = { status: 0, message: {} };
        const newUser = {
            username: username,
            name: name,
            password: password
        }
        User.create(newUser).then(user => {
            response.status = parseInt(process.env.CREATED_STATUS_CODE);
            response.message = user;
        }).catch(err => {
            response.status = parseInt(process.env.SERVER_ERROR_STATUS_CODE);
            response.message = process.env.INTERNAL_SERVER_ERROR;
        }).finally(() => {
            res.status(response.status).json(response.message);
        })
    }
}

const login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const response = { status: 0, message: {} };

    User.findOne({ username: username }).exec().then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            let token = jwt.sign({ username: user.name }, process.env.SECRTE_KEY, { expiresIn: 3600 });
            const response = {
                name: user.name,
                userName: user.username,
                token: token
            };
            res.status(200).json(response);

        } else {
            res.status(process.env.LOGIN_FAILD_STATUS_CODE).json({
                [process.env.MESSAGE]: process.env.LOGIN_FAILD
            });
        }

    }).catch(err => {
        console.log(err);
        res.status(process.env.LOGIN_FAILD_STATUS_CODE).json({
            [process.env.MESSAGE]: process.env.LOGIN_FAILD
        });
    })
}


module.exports = {
    register,
    login
}