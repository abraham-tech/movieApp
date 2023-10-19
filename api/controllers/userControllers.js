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
        User.create({
            username: username,
            name: name,
            password: password
        }).then(user => {
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
    console.log("Loggin in user");
    let username = req.body.username;
    let password = req.body.password;
    const response = { status: 0, message: {} };

    User.findOne({ username: username }).exec().then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            // let token = jwt.sign({ username: user.name }, process.env.SECRTE_KEY, { expiresIn: 3600 });
            // console.log(token);
            // res.status(200).json({ success: true, token: token });
            res.status(200).json({ success: true, message: "done" });

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